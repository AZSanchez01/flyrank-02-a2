import { randomBytes } from 'crypto'
import { Router } from 'express'
import db from './../model/db.js'

const tasksRouter = Router()

function randomAlphanumericId() {
    return randomBytes(12).toString('base64url')
}

function serializeTask(task) {
    if (!task) return task
    return { ...task, done: task.done === 1 }
}

tasksRouter.route('/').get(async (req, res) => {
    try {
        const data = db.prepare('SELECT * FROM tasks').all().map(serializeTask)
        res.json(data)
    }
    catch {
        res.status(400).json({ error: 'Cannot get task list' })
    }
}).post(async (req, res) => {
    const title = req.body?.title
    if (!title) {
        return res.status(400).json({ error: 'Cannot post new task. Title is missing' })
    }

    const id = randomAlphanumericId()
    db.prepare('INSERT INTO tasks (id, title, done) VALUES (?, ?, ?)').run(id, title, 0)
    res.status(201).json({ status: 'Successfully added new task', task: { id, title, done: false } })
})

tasksRouter.route('/:id').get(async (req, res) => {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)
    if (!task) {
        return res.status(404).json({ error: `Task "${req.params.id}" cannot be found` })
    }
    res.json(serializeTask(task))
}).put(async (req, res) => {
    const { id } = req.params
    const { title, done } = req.body
    if (!title || done == null) {
        return res.status(400).json({ error: 'Request body must contain title and done attributes' })
    }

    const result = db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(title, done ? 1 : 0, id)
    if (result.changes === 0) {
        return res.status(404).json({ error: `Task "${id}" cannot be found` })
    }
    res.json({ status: 'Successfully updated task', task: { id, title, done: !!done } })
}).delete(async (req, res) => {
    const { id } = req.params
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
    if (result.changes === 0) {
        return res.status(404).json({ error: `Task "${id}" cannot be found` })
    }
    res.sendStatus(204)
})

export default tasksRouter
