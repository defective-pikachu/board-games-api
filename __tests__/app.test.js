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
describe('GET /api/reviews', () => {
    it('200: returns an array of review objects', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.reviews)).toBe(true)
            expect(body.reviews.length).toBe(13)
            body.reviews.forEach((review) => {
                expect(review).toMatchObject({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    category: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    designer: expect.any(String),
                    comment_count: expect.any(Number)
                })
            })
        })
    })
    it('200: sorts the reviews by date in descending order', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.reviews)).toBe(true)
            expect(body.reviews.length).toBe(13)
            body.reviews.forEach((review) => {
                expect(review).toMatchObject({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    category: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    designer: expect.any(String),
                    comment_count: expect.any(Number)
                })
            expect(body.reviews).toBeSortedBy(body.reviews.created_at)
            })
        })
    })
    it('should accept a category query, which filters the reviews by the dexterity category', () => {
        return request(app)
        .get('/api/reviews?category=dexterity')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.reviews)).toBe(true)
            expect(body.reviews.length).toBe(1)
            expect(body.reviews[0]).toEqual({
                title: 'Jenga',
                designer: 'Leslie Scott',
                owner: 'philippaclaire9',
                review_img_url:
                  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Fiddly fun for all the family',
                category: 'dexterity',
                created_at: "2021-01-18T10:01:41.251Z",
                votes: 5,
                comment_count: 3,
                review_id: 2
              })
        })
    })
    it('should accept a category query, which filters the reviews by the requested category, in a case where the category should come back containing whitespace', () => {
        return request(app)
        .get('/api/reviews?category=euro+game')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.reviews)).toBe(true)
            expect(body.reviews.length).toBe(1)
            expect(body.reviews[0]).toEqual({
                title: 'Agricola',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_img_url:
                  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Farmyard fun!',
                category: 'euro game',
                created_at: "2021-01-18T10:00:20.514Z",
                votes: 1,
                review_id: 1,
                comment_count: 0
            })
        })
    })
    it('404: return an error message if the queried category does not exist', () => {
        return request(app)
        .get('/api/reviews?category=cooperative')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Requested Category (cooperative) Does Not Exist Yet')
        })
    })
    it('200: returns an empty array when category is valid but has no instances in database', () => {
        return request(app)
        .get("/api/reviews?category=children's+games")
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.reviews)).toBe(true)
            expect(body.reviews.length).toBe(0)
        })
    })
})

describe('GET /api/reviews/:reviewid', () => {
    it('200: returns an appropriate review object', () => {
        const REVIEW_ID = 3
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
            expect(body.reviews.comment_count).toBe(3)
            expect(body.reviews.review_id).toBe(3)
        })
    })
    it('404: returns an appropriate error message if an id number is requested that is too high', () => {
        const REVIEW_ID = 2352
        return request(app)
        .get(`/api/reviews/${REVIEW_ID}`)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe(`Review ${REVIEW_ID} Not Found`)
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
describe('GET /api/users', () => {
    it('200: returns an array of objects with the correct properties', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body.users)).toBe(true);
            expect(body.users.length).toBe(4);
            body.users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})

describe('PATCH /api/reviews/:reviewid', () => {
    it('200: should update a review object with an updated votes total when passed an increment votes object with a value of 1', () => {
        const REVIEW_ID = 1
        const newVote = 1
        const reviewUpdates = {
            inc_votes: newVote
          }
        return request(app)
        .patch(`/api/reviews/${REVIEW_ID}`)
        .send(reviewUpdates)
        .expect(200)
        .then((review) => {
            expect(typeof review.body).toBe('object')
            expect(review.body).toHaveProperty('title', expect.any(String))
            expect(review.body).toHaveProperty('designer', expect.any(String))
            expect(review.body).toHaveProperty('owner', expect.any(String))
            expect(review.body).toHaveProperty('review_img_url', expect.any(String))
            expect(review.body).toHaveProperty('review_body', expect.any(String))
            expect(review.body).toHaveProperty('category', expect.any(String))
            expect(review.body).toHaveProperty('created_at', expect.any(String))
            expect(review.body).toHaveProperty('votes', expect.any(Number))
            expect(review.body.review_id).toBe(1)
            expect(review.body.votes).toBe(2)
        })
    })
    it('200: should update a review object with an updated votes total when passed an increment votes object with a value of -100', () => {
        const REVIEW_ID = 1
        const newVote = -100
        const reviewUpdates = {
            inc_votes: newVote
          }
        return request(app)
        .patch(`/api/reviews/${REVIEW_ID}`)
        .send(reviewUpdates)
        .expect(200)
        .then((review) => {
            expect(typeof review.body).toBe('object')
            expect(review.body).toHaveProperty('title', expect.any(String))
            expect(review.body).toHaveProperty('designer', expect.any(String))
            expect(review.body).toHaveProperty('owner', expect.any(String))
            expect(review.body).toHaveProperty('review_img_url', expect.any(String))
            expect(review.body).toHaveProperty('review_body', expect.any(String))
            expect(review.body).toHaveProperty('category', expect.any(String))
            expect(review.body).toHaveProperty('created_at', expect.any(String))
            expect(review.body).toHaveProperty('votes', expect.any(Number))
            expect(review.body.review_id).toBe(1)
            expect(review.body.votes).toBe(-99)
        })
    })
    it('400: responds with error if inc_votes value is an invalid data type', () => {
        const REVIEW_ID = 1
        const newVote = 'great game!'
        const reviewUpdates = {
            inc_votes: newVote
          }
        return request(app)
        .patch(`/api/reviews/${REVIEW_ID}`)
        .send(reviewUpdates)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('please enter a number!')
        })
    })
    it('404: responds with error if requested review_id is currently unused', () => {
        const REVIEW_ID = 2352
        const newVote = 2
        const reviewUpdates = {
            inc_votes: newVote
          }
        return request(app)
        .patch(`/api/reviews/${REVIEW_ID}`)
        .send(reviewUpdates)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe(`Review ${REVIEW_ID} Not Found`)
        })
    })
    it('400: responds with error if passed object is empty', () => {
        const REVIEW_ID = 1
        const reviewUpdates = {}
        return request(app)
        .patch(`/api/reviews/${REVIEW_ID}`)
        .send(reviewUpdates)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('you need an inc_votes key!')
        })
    })
})