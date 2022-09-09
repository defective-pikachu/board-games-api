const { selectCommentsByReviewId, insertComment } = require('../models/comments.models')

exports.getCommentsByReviewId = (req, res, next) => {
    selectCommentsByReviewId(req.params.reviewid)
    .then((comments) => {
        res.send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}

exports.postCommentByReviewId = (req, res, next) => {
    insertComment(req.body)
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}