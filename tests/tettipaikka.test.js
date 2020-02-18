const mongoose = require('mongoose')

const dbHandler = require('./db-handler')
const tettipaikkaService = require('../src/controllers/TettipaikkaService')
const tettipaikkaModel = require('../src/models/Tettipaikka')

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect())

afterAll(async () => await dbHandler.closeDatabase())

/* Plain object for testing, only required fields */
const tettipaikkaComplete = {
    title: 'Tiiriön ABC',
    tehtavat: 'Siivousta',
    yhteydenottotapa: 'Tekstiviestitse',
}

/* Tettipaikka test suite */
describe('tettipaikka ', () => {
    it('can be created correctly', async () => {
        expect(
            async () => await tettipaikkaService.create(tettipaikkaComplete)
        ).not.toThrow()
    })

    it('database returns all objects', async () => {
        expect(typeof (await tettipaikkaService.getAllPaikka())).toBe('object')
    })

    it('database returns single object', async () => {
        expect(
            typeof (await tettipaikkaService.getSinglePaikka('Tiir')._id)
        ).not.toBeNull()
    })
})
