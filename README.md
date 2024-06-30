# Information Retrieval

> A humble learning assistant made with LLAMA.

Project is created for an exam druing the university course Information Retrieval.

## Sequence of component interactions

```mermaid
sequenceDiagram
    participant user as App user
    participant server as Flask server
    participant model as Model API
    user->>+server: Initialize session
    server->>+model: Create class instance
    server->>user: Session ID
    user->>server: Select topic
    server->>model: Produce questions and answers
    model->>server: Rertreive Q&A and store them
    loop has questions
        par answering
        server->>user: Return question
        user->>server: Send answer
        and grading
        server->>model: Grade answer
        model->>server: Return grade
        server->>user: Return grade
        end
    end
    user->>server: Close session
    server->>model: Close session
    model->>-server: Confirmation
    server->>-user: Confirmation
```

## To use API

To test the API for the web application, you can use [Bruno](https://www.usebruno.com/) as a simple,
Postman-like API testing tool. The Bruno collection is located in the [bruno/](./bruno/) directory.

## Authors

- Dušan Simić <dusan.simic@dmi.uns.ac.rs>
- Vladimir Kovačević <vladimir.kovacevic@dmi.uns.ac.rs>

## License

[BSD 2-clause](./LICENSE)
