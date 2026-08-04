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
* **Data:** Better-SQLite3

### Summary:
The web application uses Express for backend routing. Better-SQLite3 was used to simulate a lightweight database for single-file, zero-setup database functions while ensuring data won't get wiped out every time the server closes.  

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

## Sample Query
| Query | Output |
| --- | --- |
SELECT * FROM tasks; | [{"id":"efgh","title":"newtitle","done":0}, <br> {"id":"jdisvogrhvbtrubeu","title":"im the newest task","done":0},<br> {"id":"9af2e32d-9fa7-4ce3-b4d9-7b2f2b546728","title":"im thenewest nrewest ","done":0}] |

