FROM python:3.12.0b4-slim
ENV FLASK_APP=app
WORKDIR /app
COPY python/requirements.txt .
RUN pip3 install -r requirements.txt
COPY python .
EXPOSE 8000
CMD ["python3", "-m", "flask", "run", "--host", "0.0.0.0", "--port", "8000"]
