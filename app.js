import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import Tettipaikka from './src/controllers/TettipaikkaService'

const app = express()

//import test db for npm run start
const mongoose = require('mongoose')
const dbHandler = require('./tests/db-handler')
dbHandler.connect()

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//DEFAULTS
const MIN_SEARCH_LENGTH = 3

const tettipaikkaComplete = {
    title: 'ABC Tiiriö',
    tehtavat: 'Siivousta',
    yhteydenottotapa: 'Tekstiviestitse',
}
const tettipaikkaComplete2 = {
    title: 'Myyntijehut Oy',
    tehtavat: 'Myyntitehtäviä',
    yhteydenottotapa: 'Puhelimitse',
}

Tettipaikka.create(tettipaikkaComplete)
Tettipaikka.create(tettipaikkaComplete2)

//GET handlers
app.get('/paikat', async (req, res) => {
    const paikat = await Tettipaikka.getAllPaikka()

    //Keep for debug
    console.log(`Received request from IP: ${req.ip}`)
    res.status(200)
    res.send(JSON.stringify(paikat))
})

app.get('/search', async (req, res) => {
    console.log(req.query)

    if (req.query.title.length < MIN_SEARCH_LENGTH) {
        res.send({ error: 'query length too short' })
    }

    const paikat = await Tettipaikka.searchPaikkaByTitle(req.query.title)

    //Keep for debug
    console.log(`Received request from IP: ${req.ip}`)
    res.status(200)
    res.send(JSON.stringify(paikat))
})

//POST handlers
app.post('/add', async (req, res) => {
    const newpaikka = req.body

    if (await Tettipaikka.create(newpaikka)) {
        res.status(201)
        res.send('OK')
    } else {
        res.status(400)
        res.send()
    }
})

//listen
app.listen(process.env.PORT || 3001, () => {
    console.log('App listening.')
})
