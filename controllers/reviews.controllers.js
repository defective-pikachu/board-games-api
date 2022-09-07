const { checkExists } = require('../db/seeds/utils')
const { selectReviews, selectReviewById, updateReviewById, selectCommentsByReviewId } = require('../models/reviews.models')

exports.getReviews = (req, res, next) => {
    const { sort_by, category } = req.query
    const reviewsSelection = selectReviews(sort_by, category)
    const promisesArray = [reviewsSelection]
    if (category) {
        promisesArray.push(checkExists('categories', 'slug', category))
    }
    Promise.all(promisesArray)
    .then((reviews) => {
        res.send({reviews: reviews[0]})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getReviewById = (req, res, next) => {
    selectReviewById(req.params.reviewid)
    .then((reviews) => {
        res.send({ reviews });
    })
    .catch((err) => {
        next(err)
    });
}

exports.getCommentsByReviewId = (req, res, next) => {
    console.log(req.params.reviewid, 'checking this')
    selectCommentsByReviewId(req.params.reviewid)
    .then((comments) => {
        res.send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchReviewById = (req, res, next) => {
    const updates = req.body
    const id = req.params.reviewid
    updateReviewById(id, updates)
    .then((rows) => {
        res.status(200).send(rows)
    })
    .catch((err) => {
        next(err)
    })
}