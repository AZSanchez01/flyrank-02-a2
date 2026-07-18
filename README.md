# Task List CRUD API
A simple API server using Express.js and having CRUD functionality.

## Setup/Installation
Clone the repository. Then, run the ff code seperately in order:
```
# 1. Install dependencies 
npm install

# 2. Run server
npm run dev
```

## Techstack
* **Runtime/Language:** Node.js / Javascript
* **Framework:** Express
* **Data**: Uses dummy data using a json file

## API Endpoints
Note this is run locally and all API requests are prefixed with `http://localhost:3000`

| Endpoint | Method | Request Parameters | Request Body |  Description |
| --- | --- | --- | --- | --- |
| / | `GET` | - | - | Get metadata of server |
| /health | `GET` | - | - | Get health of server |
| /tasks | `GET` | - | - | Get task list |
| /tasks | `POST` | - | `Title` | Create a new task |
| /tasks/{id} | `GET` | `id` | - | Get a specific task |
| /tasks/{id} | `PUT` | `id` | `title`, `done` | Edit a specific task |
| /tasks/{id} | `GET` | `id` | - | Get a specific task |


