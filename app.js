const express = require('express')
const app = express()

app.get("/", (req, res) => {
    res.json({"name": "Task API", "version": "1.0", "endpoints": "/tasks"})
})
app.get("/health", (req, res) => {
    res.json({"status": "ok"})
})

PORT = process.env.PORT || 3000
app.listen(PORT, (error) => {
    if (error) {
        console.log(`❌ Error: Express app unable to listen on port ${PORT}`)
    }
    console.log(`✔️ Success! Express app listening on port ${PORT}`)
})




