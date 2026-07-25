import { randomUUID } from 'crypto'
import { Router } from 'express'
import { writeFile } from 'fs/promises'
import { readFile } from 'fs/promises'
import path from 'path'
import db from './../model/db.js'

const tasksRouter = Router()

tasksRouter.route('/').get(async (req, res) => {
    try {
        const getTasks = db.prepare('SELECT * FROM tasks')
        const data = getTasks.all()
        res.json(data)
    }
    catch {
        throw new Error(`Error: Cannot get data...`)
    }
}).post(async (req, res) => {
    // get task title
    const title = req.body.title
    if (!title) {
        res.status(400).json({"error": "Cannot post new task. Title is missing"})
    }

    // Create new task
    const id = randomUUID()
    const insertTask = db.prepare(`INSERT INTO tasks VALUES (?, ?, ?)`)
    insertTask.run(id, title, 0)
    res.status(201).json({"status": "Successfully added new task", "task": {"id": id, "title": title, "done": false}})
})

tasksRouter.route('/:id').put(async (req, res) => {
    const { id } = req.params
    const { title, done } = req.body
    if (!id || !title || done == null) {
        res.status(400).json({"error": "Request body must contain id, title, and done attributes"})
    }
    try {
        const data = await getData()
        const oldTaskExists = data.some((task) => task.id == id)
        if (!oldTaskExists) {
            res.status(404).json({"error": "ID of task to update cannot be found"})
        }
        const updatedData = data.map((task) => (task.id == id)? {id, title, done} : task)
        const filePath = path.join(process.cwd(), 'model', 'data.json')
        await writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8')
        res.status(200).json({"status": "Successfully updated file"})
    }
    catch {
        throw new Error('Error: Cannot update task')
    }
}).delete(async (req, res) => {
    const { id } = req.params
    if (!id) {
        res.status(400).json({"error": "ID missing from delete request parameters"})
    }
    try {
        const data = await getData()
        const taskExists = data.some((task) => task.id == id)
        if (!taskExists) {
            res.status(404).json({"error": "Id of task does not exist"})
        }
        const updatedData = data.filter((task) => task.id != id)
        const filePath = path.join(process.cwd(), 'model', 'data.json')
        await writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8')
        res.sendStatus(204)
    }
    catch {
        throw new Error('Error: Cannot delete task')
    }
})

tasksRouter.route('/:id').get(async (req, res) => {
    const getTask = db.prepare(`SELECT * from tasks where id = ?`)
    const task = getTask.get(req.params.id)
    if (!task || task == undefined) {
        res.status(404).json({error: 'task "${req.params.id}" cannot be found'})
    }
    res.json(task)
})

async function getData() {
    try {
        const filePath = path.join(process.cwd(), 'model', 'data.json')
        const fileData = await readFile(filePath, 'utf8')
        return JSON.parse(fileData)
    }
    catch {
        throw Error('Error: Cannot find or parse data...')
    }
}

export default tasksRouter