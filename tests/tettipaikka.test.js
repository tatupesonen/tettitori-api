const mongoose = require('mongoose')

const dbHandler = require('./db-handler')
const tettipaikkaService = require('../src/controllers/TettipaikkaService')
const tettipaikkaModel = require('../src/models/Tettipaikka')

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect())

afterAll(async () => await dbHandler.closeDatabase())

/* Plain objects for testing, only required fields */
const tettipaikkaComplete = {
    title: 'Tiiriön ABC',
    tehtavat: 'Siivousta',
    yhteydenottotapa: 'Tekstiviestitse',
}

const tettipaikkaComplete2 = {
    title: 'Markon siivousliike',
    tehtavat: 'Imurointia',
    yhteydenottotapa: 'Sähköpostitse',
}

const tettipaikkaComplete3 = {
    title: 'Tiiriön osuuspankki',
    tehtavat: 'Imurointia',
    yhteydenottotapa: 'Sähköpostitse',
}

//We will need this in our tests
let singleId = ''

/* Tettipaikka test suite */
describe('tettipaikka ', () => {
    it('can be created correctly', async () => {
        expect(
            async () => await tettipaikkaService.create(tettipaikkaComplete)
        ).not.toThrow()
    })

    it('second one can be created correctly', async () => {
        expect(
            async () => await tettipaikkaService.create(tettipaikkaComplete2)
        ).not.toThrow()
    })

    it('third one can be created correctly', async () => {
        expect(
            async () => await tettipaikkaService.create(tettipaikkaComplete3)
        ).not.toThrow()
    })

    it('wait for db sync', async () => {
        await new Promise(r => setTimeout(r, 100))
    })

    it('database returns single object with full name match', async () => {
        const result = await tettipaikkaService.getSinglePaikka('Tiiriön ABC')
        expect(typeof result._id).not.toBeNull()
    })

    it('database returns single object with partial match', async () => {
        const result = await tettipaikkaService.getSinglePaikka('Tiir')
        singleId = result._id
        expect(typeof result._id).not.toBeNull()
    })

    it('database returns two objects with title search', async () => {
        const result = await tettipaikkaService.searchPaikkaByTitle('Tiir')
        expect(result.length).toBe(2)
    })

    it('database returns all objects', async () => {
        let result = await tettipaikkaService.getAllPaikka()
        let log = ''
        result.forEach(r => {
            log = log + `${r.title} \n`
        })
        console.log(
            'MongoDB collection status \n---------------------' + '\n' + log
        )
        expect(typeof result).toBe('object')
    })

    it('can delete the single object', async () => {
        let result = await tettipaikkaService.delete(singleId)
        expect(result.deletedCount).toBe(1)
    })
})
