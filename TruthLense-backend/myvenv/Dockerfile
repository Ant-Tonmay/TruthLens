FROM python:3.12.7-slim

WORKDIR /app

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "truthlense:app", "--host", "0.0.0.0", "--port", "8000"]
