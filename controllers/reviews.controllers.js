const { checkExists } = require('../db/seeds/utils')
const { selectReviews, selectReviewById, updateReviewById } = require('../models/reviews.models')

exports.getReviews = (req, res, next) => {
    console.log('surely we are in the controller')
    const { sort_by, category } = req.query
    // if (category) {
    //     console.log(category, 'are we in here')
    //     return checkExists('categories', 'slug', category)
    // }
    // selectReviews( sort_by, category )
    const promisesArray = [selectReviews( sort_by, category )]
    if (category) {
        promisesArray.push(checkExists('categories', 'slug', category))
    }
    Promise.all(promisesArray)
    .then((reviews) => {
        res.send({ reviews })
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