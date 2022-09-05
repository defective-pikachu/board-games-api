const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index.js');
const app = require('../app');
const request = require('supertest');

beforeEach(() => {
    return seed(testData)
});

afterAll(() => {
    return db.end()
})

describe('GET requests', () => {
    it('should respond with a 404 error if the GET request is made on any endpoint other than /categories', () => {
        return request(app)
        .get('/api/wombats')
        .expect(404)
        .then((response) => {
            expect(response.body).toEqual({msg: 'path does not exist'})
        })
    })
})

describe('GET /api/categories', () => {
    it('200: returns with an array of categories', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body.categories)).toBe(true);
            expect(body.categories.length).toBe(4);
            body.categories.forEach((category) => {
                expect(category).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                });
            })
        })
    })
})