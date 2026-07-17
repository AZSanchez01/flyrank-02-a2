const express = require('express')
const app = express()

app.get("/", (req, res) => {
    res.send("Hello World!")
})

PORT = process.env.PORT || 3000
app.listen(PORT, (error) => {
    if (error) {
        console.log(`❌ Error: Express app unable to listen on port ${PORT}`)
    }
    console.log(`✔️ Success! Express app listening on port ${PORT}`)
})




