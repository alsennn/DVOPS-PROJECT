const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const { app, server } = require('../index');
const fs = require('fs').promises;
const chai = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');

chai.use(chaiHttp);

let baseUrl;
const testFile = path.resolve('utils/resources.json'); // Temporary test file for JSON operations

describe('Resource API', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;
    });

    after(() => {
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    beforeEach(async () => {
        // Initialize the test file with an empty array before each test
        await fs.writeFile(testFile, JSON.stringify([]), 'utf8');
    });

    afterEach(async () => {
        // Clean up the test file after each test
        await fs.writeFile(testFile, JSON.stringify([]), 'utf8');
    });

    describe('POST /add-resource', () => {
        it('should return 400 for invalid author email', (done) => {
            chai.request(baseUrl)
                .post('/add-resource')
                .send({
                    title: 'Test Resource',
                    description: 'Short description',
                    author: 'invalid-email',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Validation error: Invalid email format');
                    done();
                });
        });

        it('should return 400 for duplicate title', async () => {
            const initialData = [
                { title: 'Duplicate Title', description: 'Unique Description', author: 'test@example.com' },
            ];
            await fs.writeFile(testFile, JSON.stringify(initialData), 'utf8');

            return chai
                .request(baseUrl)
                .post('/add-resource')
                .send({
                    title: 'Duplicate Title',
                    description: 'New Description',
                    author: 'new@example.com',
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Title already exists');
                });
        });

        it('should return 400 for duplicate description', async () => {
            const initialData = [
                { title: 'Unique Title', description: 'Duplicate Description', author: 'test@example.com' },
            ];
            await fs.writeFile(testFile, JSON.stringify(initialData), 'utf8');

            return chai
                .request(baseUrl)
                .post('/add-resource')
                .send({
                    title: 'New Title',
                    description: 'Duplicate Description',
                    author: 'new@example.com',
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Description already exists');
                });
        });

        it('should return 400 for duplicate title and description', async () => {
            const initialData = [
                { title: 'Duplicate Title', description: 'Duplicate Description', author: 'test@example.com' },
            ];
            await fs.writeFile(testFile, JSON.stringify(initialData), 'utf8');

            return chai
                .request(baseUrl)
                .post('/add-resource')
                .send({
                    title: 'Duplicate Title',
                    description: 'Duplicate Description',
                    author: 'new@example.com',
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Title and Description already exist');
                });
        });

        it('should add a new resource and return 201', (done) => {
            chai.request(baseUrl)
                .post('/add-resource')
                .send({
                    title: 'New Resource',
                    description: 'A unique description',
                    author: 'test@example.com',
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(1);
                    const lastResource = res.body[res.body.length - 1];
                    expect(lastResource).to.have.property('title').equal('New Resource');
                    expect(lastResource).to.have.property('description').equal('A unique description');
                    expect(lastResource).to.have.property('author').equal('test@example.com');
                    done();
                });
        });

        it('should return 400 when title is missing', (done) => {
            chai.request(baseUrl)
                .post('/add-resource')
                .send({
                    title: '',
                    description: 'A short description',
                    author: 'test@example.com',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.be.a('string').and.to.include('Title is required');
                    done();
                });
        });

        it('should return 400 when description is missing', (done) => {
            chai.request(baseUrl)
                .post('/add-resource')
                .send({
                    title: 'Valid Title',
                    description: '',
                    author: 'test@example.com',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.be.a('string').and.to.include('Description is required');
                    done();
                });
        });

        it('should return 400 when author is missing', (done) => {
            chai.request(baseUrl)
                .post('/add-resource')
                .send({
                    title: 'Valid Title',
                    description: 'A short description',
                    author: '',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.be.a('string').and.to.include('Author email is required');
                    done();
                });
        });
        

    });

    describe('Utility Functions', () => {
        const { readJSON, writeJSON } = require('../utils/AlsenUtil');

        it('should throw an error when reading a non-existent file', async () => {
            try {
                await readJSON('non_existent_file.json');
            } catch (err) {
                expect(err).to.be.an('error');
            }
        });

        it('should throw an error when writing to a non-existent file', async () => {
            try {
                await writeJSON(
                    { title: 'Test', description: 'Test', author: 'test@example.com' },
                    'invalid_directory/resources.json'
                );
            } catch (err) {
                expect(err).to.be.an('error');
            }
        });

        it('should write data to the test file and read it back', async () => {
            const testData = { title: 'Test Title', description: 'Test Description', author: 'test@example.com' };
            await writeJSON(testData, testFile);

            const data = await readJSON(testFile);
            expect(data).to.be.an('array');
            expect(data.length).to.equal(1);
            expect(data[0]).to.deep.equal(testData);
        });
    });
});
