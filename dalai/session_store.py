class SessionStore:
    def __init__(self) -> None:
        self.sessions = {}
        self.next_id = 0

    def new_session(self):
        self.sessions[self.next_id] = {}
        self.next_id += 1
        return self.next_id - 1

    def get_session(self, id):
        self.__validate_session(id)
        return self.sessions[id]

    def close_session(self, id):
        self.__validate_session(id)
        del self.sessions[id]

    def __validate_session(self, id):
        if id not in self.sessions:
            raise ValueError(f"session by id {id} doesn't exist")

    def _sessions(self):
        return self.sessions.keys()
