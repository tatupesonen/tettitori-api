import express from 'express'
import bodyParser from 'body-parser'
import Tettipaikka from './src/controllers/TettipaikkaService'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//GET handlers
app.get('/', (req, res) => {
    //Keep for debug
    console.log(`Received request from IP: ${req.ip}`)
})

//POST handlers

//listen
app.listen(process.env.PORT || 3000, () => {
    console.log('App listening.')
})
