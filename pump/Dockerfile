FROM oven/bun:latest

LABEL org.opencontainers.image.source=https://github.com/NoseferatuWKF/pnd

COPY . .

RUN apt update && apt install -y chromium && bun i
