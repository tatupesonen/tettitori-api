import Job from "../schema/Job";
import Role from '../schema/Role';
import User from '../schema/User';
import server from '../app';

export { };
process.env.NODE_ENV = 'test';
process.env.DB_MODE = 'ETHEREAL';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);
let testUser: any, testRole: any; //Define here for global scope

//Our parent block
describe('Jobs', () => {
    before(async function () {
        server.on("started", async () => {
            //Load the workplace role
            testRole = await Role.findOne({ name: "workplace" });
            //Create and load the test user
            testUser = await User.create({
                username: "TestRunner",
                password: "password123",
                email: "test@hml.fi",
                role: testRole!._id,
            })
        })
    })
    beforeEach(async () => { //Before each test we empty the relevant collection
        return Job.deleteMany({}, (err) => {
        });
    });
    describe('/GET job with no jobs in db', () => {
        it('it should GET all jobs and return empty array', (done) => {
            chai.request(server)
                .get('/api/job')
                .end((err: any, res: any) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
    describe('/GET job with some jobs in the db', () => {
        beforeEach(async () => {
            Job.create({
                title: "Job in tests",
                body: "This field would contain the body",
                author: testUser!._id,
            });
        })
        it('it should GET all jobs and return all jobs', (done) => {
            chai.request(server)
                .get('/api/job')
                .end((err: any, res: any) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].should.have.property('title');
                    done();
                });
        });
    });
    describe('/POST create a new job without authorization', () => {
        it('it should fail a new job on server and return id', (done) => {
            chai.request(server)
                .post('/api/job')
                .type('json')
                .send({
                    "title": "Here's a test job in mocha",
                    "body": "We also need the body so it works"
                })
                .end((err: any, res: any) => {
                    res.should.have.status(401);
                    res.body.should.not.have.property('_id');
                    done();
                });
        });
    });

});