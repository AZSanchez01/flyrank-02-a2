import express from 'express'
import tasksRouter from './routes/tasksRouter.js'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './openapi.json' with {type: "json"}
import db from './model/db.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ "extended": true }))

app.get("/", (req, res) => {
    res.json({
        "name": "Task API",
        "version": "1.0",
        "health": "/health",
        "endpoints": ["/health", "/tasks", "/docs"]
    })
})

app.get("/health", (req, res) => {
    const dbHealthy = db.open && db.prepare('SELECT 1 AS ok').get().ok === 1
    res.json({ "status": dbHealthy ? "ok" : "degraded" })
})

app.use('/tasks', tasksRouter)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const PORT = process.env.PORT || 3000
app.listen(PORT, (error) => {
    if (error) {
        console.log(`Error: Express app unable to listen on port ${PORT}`)
        return
    }
    console.log(`Success! Express app listening on port ${PORT}`)
})
