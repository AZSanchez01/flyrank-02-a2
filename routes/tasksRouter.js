import { randomUUID } from 'crypto'
import { Router } from 'express'
import { writeFile } from 'fs/promises'
import { readFile } from 'fs/promises'
import path from 'path'

const tasksRouter = Router()

tasksRouter.route('/').get(async (req, res) => {
    try {
        const data = await getData()
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
    const newTask = {"id": randomUUID(), "title": title, "done": false}
    const data = await getData()
    data.push(newTask)

    // Write to data
    const filePath = path.join(process.cwd(), 'model', 'data.json')
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
    res.status(201).json({"status": "Successfully saved file"})
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
    const data = await getData()
    const id = req.params.id
    const task = data.find((task) => task.id == id)
    if (!task) {
        res.status(404).json(`error: task "${id}" cannot be found`)
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