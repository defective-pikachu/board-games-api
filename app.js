const { response } = require('express');
const express = require('express')
const { getCategories } = require('./controllers/categories.controllers')
const { getReviews, getReviewById, patchReviewById } = require('./controllers/reviews.controllers')
const { getUsers } = require('./controllers/users.controllers')

const app = express();
app.use(express.json())

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:reviewid', getReviewById)

app.get('/api/users', getUsers)

app.patch('/api/reviews/:reviewid', patchReviewById)

// handle custom errors

app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'path does not exist'})
} )

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({
            msg: err.msg })
    } else {
            next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request' })
    } else {
        next(err)
    }
})

// handle all 500 errors

app.use((err, req, res, next) => {
    res.status(500).send({
        msg: 'Internal Server Error'
    })
})

module.exports = app;