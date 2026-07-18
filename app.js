import express from 'express'
import tasksRouter from './routes/tasksRouter.js'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './openapi.json' with {type: "json"}

const app = express()

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(express.json())
app.use(express.urlencoded({"extended": true}))

// 1.1 Status routes
app.get("/", (req, res) => {
    res.json({"name": "Task API", "version": "1.0", "endpoints": ["/tasks", '/health', '/docs']})
})
app.get("/health", (req, res) => {
    res.json({"status": "ok"})
})

// 1.2 Tasks routes
app.use('/tasks', tasksRouter)

// X. Listen on port
const PORT = process.env.PORT || 3000
app.listen(PORT, (error) => {
    if (error) {
        console.log(`❌ Error: Express app unable to listen on port ${PORT}`)
    }
    console.log(`✔️ Success! Express app listening on port ${PORT}`)
})




