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
describe('GET /api/reviews/:reviewid', () => {
    it('200: returns an appropriate review object', () => {
        const REVIEW_ID = 1
        return request(app)
        .get(`/api/reviews/${REVIEW_ID}`)
        .expect(200)
        .then(({ body }) => {
            expect(typeof body).toBe('object')
            expect(typeof body.reviews).toBe('object')
            expect(body.reviews).toHaveProperty('title', expect.any(String))
            expect(body.reviews).toHaveProperty('designer', expect.any(String))
            expect(body.reviews).toHaveProperty('owner', expect.any(String))
            expect(body.reviews).toHaveProperty('review_img_url', expect.any(String))
            expect(body.reviews).toHaveProperty('review_body', expect.any(String))
            expect(body.reviews).toHaveProperty('category', expect.any(String))
            expect(body.reviews).toHaveProperty('created_at', expect.any(String))
            expect(body.reviews).toHaveProperty('votes', expect.any(Number))
            expect(body.reviews).toHaveProperty('review_id', expect.any(Number))
        })
    })
    it('404: returns an appropriate error message if an id number is requested that is too high', () => {
        const REVIEW_ID = 2352
        return request(app)
        .get(`/api/reviews/${REVIEW_ID}`)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Review Not Found')
        })
    })
    it('400: responds with error when user requests invalid id data type', () => {
        return request(app)
        .get('/api/reviews/wombat')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
})