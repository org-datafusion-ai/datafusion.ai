FROM node:23 AS frontend
ARG REACT_APP_API_HOST='http://localhost/api'
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend .
ENV REACT_APP_API_HOST=$REACT_APP_API_HOST
RUN npm run build

FROM node:23 as backend
WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend .
RUN npm run build

FROM node:23
WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install --omit=dev
COPY --from=frontend /app/build ./public
COPY --from=backend /app/dist ./dist

ENV DB_URI='mongodb://localhost/datafusion'
ENV PORT=80
ENV CORS='http://localhost'
ENV JWT_SECRET='d80089784f12481d7df7726dd8c7245c3c75b58de06da2817f26adda024950fb'

EXPOSE $PORT
CMD ["node", "dist/main"]
