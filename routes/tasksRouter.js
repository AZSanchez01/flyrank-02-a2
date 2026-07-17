import { randomUUID } from 'crypto'
import { Router } from 'express'
import { writeFile } from 'fs'
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
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (error) => {
        if (error){
            console.error('Failed to save file', error)
            res.status(500).json({"error": "Unable to save file"})
        }
        res.status(200).json({"status": "Successfully saved file"})
    })
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