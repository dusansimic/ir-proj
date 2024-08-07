from flask import Flask, request
from flask_cors import CORS, cross_origin
import json
from session_store import SessionStore
from util import Res

from llama_stuff import LlamaSession

# from mock.llama_stuff import LlamaSession

app = Flask(__name__)
CORS(app)


store = SessionStore()


@app.get("/ping")
@cross_origin()
def ping():
    return "pong", 200


@app.get("/create-session")
@cross_origin()
def create_session():
    res = {"id": store.new_session()}
    return json.dumps(res), 200


@app.post("/set-paragraph")
@cross_origin()
def set_paragraph():
    id, paragraph = request.json["id"], request.json["paragraph"]
    res = Res()
    try:
        session = store.get_session(id)
        session["model_session"] = LlamaSession(paragraph)
    except ValueError:
        res.set("Session id doesn't exist in store!", 404)
    except:
        res.set("This is really bad.", 500)
    return res.get()


@app.get("/start-session/<int:id>")
@cross_origin()
def start_session(id):
    res = Res()
    try:
        session = store.get_session(id)
        session["model_session"].start_session()
    except:
        res.set("This is really bad.", 500)
    return res.get()


@app.get("/get-session/<int:id>")
@cross_origin()
def get_session(id):
    res = Res()
    try:
        session = store.get_session(id)
        obj = {
            "paragraph": None,
            "questions": None,
            "grades": None,
        }
        model = session["model_session"]
        obj["paragraph"] = model.paragraph
        obj["questions"] = model.questions
        obj["answers"] = model.answers
        res.set(json.dumps(obj), 200)
    except ValueError:
        res.set("Session id doesn't exist in store!", 404)
    except Exception as e:
        print(e)
        res.set("This is really bad.", 500)
    return res.get()


@app.post("/grade-answer")
@cross_origin()
def grade_answer():
    id, qi, answer = (
        request.json["id"],
        request.json["question_index"],
        request.json["answer"],
    )
    res = Res()
    try:
        session = store.get_session(id)
        model = session["model_session"]
        grading = model.receive_answers(answer, qi)
        res.set(grading, 200)
    except:
        res.set("This is really bad.", 500)
    return res.get()
