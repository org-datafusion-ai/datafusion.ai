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
ENV DB_USERNAME=''
ENV DB_PASSWORD=''
ENV DB_URI=''
ENV AZURE_GPT4_API_KEY=''
ENV AZURE_GPT4_ENDPOINT=''

EXPOSE $PORT
CMD ["node", "dist/main"]
