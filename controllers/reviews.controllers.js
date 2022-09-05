const { selectReviewById } = require('../models/reviews.models')

exports.getReviewById = (req, res, next) => {
    selectReviewById(req.params.reviewid)
    .then((reviews) => {
        if (reviews === undefined) {
            return Promise.reject({ status: 404, msg: 'Review Not Found'})
        } 
        res.send({ reviews });
    })
    .catch((err) => {
        next(err)
    });
}