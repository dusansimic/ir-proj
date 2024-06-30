class Res:
    def __init__(self) -> None:
        self.text = ""
        self.code = 200

    def set(self, text, code):
        self.text = text
        self.code = code

    def get(self):
        return self.text, self.code
