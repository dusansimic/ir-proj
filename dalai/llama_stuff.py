import re
from llama_cpp import Llama

# import pandas as pd

MODEL_PATH = "/Users/vladco/.cache/huggingface/hub/models--TheBloke--Llama-2-13B-chat-GGML/snapshots/3140827b4dfcb6b562cd87ee3d7f07109b014dd0/llama-2-13b-chat.ggmlv3.q5_1.bin"


class LlamaPrompter:
    def __init__(self, base_template):
        self.model = Llama(
            model_path=MODEL_PATH, n_threads=10, n_batch=512, n_gpu_layers=32
        )
        self.base_template = base_template

    def prepare_prompt(self, **kwargs):
        return self.base_template.format(**kwargs)

    def prompt_model(self, prompt):
        response = self.model(
            prompt=prompt,
            max_tokens=256,
            temperature=0.5,
            top_p=0.95,
            repeat_penalty=1.2,
            top_k=150,
            echo=True,
        )

        return response


class LlamaParser:
    def __init__(self, parse_function):
        self.parse_function = parse_function

    def parse_output(self, model_output):
        return self.parse_function(model_output)


class LlamaSession:
    def __init__(self, paragraph):
        self.base_template_1 = """SYSTEM: You are a humble learning assistant trained to generate questions and provide answers based on the provided text. Be clear and concise.

USER: Generate three question and corresponding answers based on the following paragraph.
Output should be in format: 
Q: [your question]
A: [your answer to your question]
Context: {paragraph}

ASSISTANT:
"""
        self.base_template_2 = """SYSTEM: You are a humble learning assistant trained to analyze learner answer on provided text and corresponding question. Be clear and concise.

USER: Based on the following paragraph, question, correct answer and user answer, tell to user if his answer was correct, and very briefly explain why.
Paragraph: {paragraph}
Question: {question}
Correct answer: {correct_answer}
User answer: {user_answer}

ASSISTANT:
"""
        self.prompter = LlamaPrompter(self.base_template_1)
        self.prompter_grader = LlamaPrompter(self.base_template_2)
        self.parser_questions_answers = LlamaParser(self.parse_questions_answers)
        self.parser_grades = LlamaParser(self.parse_grades)
        self.questions = None
        self.answers = None
        self.paragraph = paragraph

    def start_session(self):
        prompt = self.prompter.prepare_prompt(paragraph=self.paragraph)
        # print(prompt)
        raw_output = self.prompter.prompt_model(prompt)
        # print(raw_output)
        self.questions, self.answers = self.parser_questions_answers.parse_output(
            raw_output["choices"][0]["text"]
        )

    def receive_answers(self, user_answers, idx):
        prompt = self.prompter_grader.prepare_prompt(
            paragraph=self.paragraph,
            question=self.questions[idx],
            correct_answer=self.answers[idx],
            user_answer=user_answers,
        )
        # print('prompt:', prompt, '\n')
        raw_output = self.prompter_grader.prompt_model(prompt)
        # print(raw_output['choices'][0]['text'])
        grading_result = self.parser_grades.parse_output(
            raw_output["choices"][0]["text"]
        )

        return grading_result

    @staticmethod
    def parse_questions_answers(model_output):
        # parsira i prvo Q i A koji su placeholderi, zajdeb'o sam se, treba prvo split to asistentu
        questions = re.findall(r"Q: (.*?)\s+A:", model_output)
        answers = re.findall(r"A: (.*?)(?=Q:|$)", model_output, flags=re.DOTALL)
        return questions[1:], [answer.strip() for answer in answers][1:]

    @staticmethod
    def parse_grades(model_output):
        return model_output.split("ASSISTANT:")[1].strip()

    def get_results(self):
        return self.questions, self.answers
