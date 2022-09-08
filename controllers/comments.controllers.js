const { selectCommentsByReviewId } = require('../models/comments.models')

exports.getCommentsByReviewId = (req, res, next) => {
    selectCommentsByReviewId(req.params.reviewid)
    .then((comments) => {
        res.send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}