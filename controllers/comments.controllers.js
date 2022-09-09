const { selectCommentsByReviewId, insertComment, removeComment, selectCommentById } = require('../models/comments.models')

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

exports.deleteComment = (req, res, next) => {
    const commentToDelete = req.params.commentid
    removeComment(commentToDelete)
    .then((comment) => {
        res.status(204).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getCommentById = (req, res, next) => {
    selectCommentById(req.params.commentid)
    .then((reviews) => {
        res.send({ reviews });
    })
    .catch((err) => {
        next(err)
    });
}