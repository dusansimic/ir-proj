class LlamaSession:
    def __init__(self, paragraph) -> None:
        self.paragraph = paragraph
        self.questions = None
        self.answers = None

    def start_session(self):
        self.questions = ["Q1", "Q2", "Q2"]
        self.answers = ["A1", "A2", "A3"]

    def get_results(self):
        return (
            ["Q1", "Q2", "Q3"],
            ["A1", "A2", "A3"],
        )

    def receive_answers(self, user_answers, idx):
        return "G"
