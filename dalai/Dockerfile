FROM docker.io/continuumio/miniconda3:24.5.0-0

COPY environment.yml /tmp/environment.yml
RUN conda env create -f /environment.yml

WORKDIR /app
COPY . .

CMD [ "conda", "run", "-n", "server", "python", "-m", "flask", "--app", "dalai/main.py", "run", "--no-debugger", "--no-reload" ]
