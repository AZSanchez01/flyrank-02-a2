import { Router } from 'express'
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