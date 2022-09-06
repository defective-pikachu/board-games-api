const { selectReviewById, updateReviewById } = require('../models/reviews.models')

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