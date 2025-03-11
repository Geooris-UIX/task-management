const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
    res.send('Task Management Backend')
})

app.listen(port, () => {
    console.log(`[Server]: Server is running at http://localhost:${port}`)
})