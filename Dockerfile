FROM oven/bun:latest

COPY . .

RUN apt update && apt install -y chromium && bun i
