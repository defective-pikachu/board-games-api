const db = require("../db/connection");

exports.selectCommentsByReviewId = (reviewid) => {
    let numberOfReviews = 0
    return db
        .query(`SELECT review_id FROM reviews`).then((result) => {
            numberOfReviews = result.rows.length
        }).then(() => {
            const queryStr = `SELECT * FROM comments WHERE comments.review_id=$1;`
            return db
                .query(queryStr, [reviewid])
        })
                .then(({ rows }) => {
                    if (rows.length === 0) {
                    if (reviewid < numberOfReviews) return Promise.resolve(rows)
                    return Promise.reject({ status: 404, msg: `Review ${reviewid} Not Found`})
                    } 
                return rows
                })
}

exports.insertComment = (newComment) => {
    let numberOfReviews = 0
    const { author, body, review_id } = newComment
    const queryStr = `SELECT username FROM users WHERE users.username=$1;`
    return db
        .query(queryStr, [author]).then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 400, msg: `username ${author} does not exist!`})
                } else return Promise.resolve()
            .then(() => {
                return db
                    .query(`SELECT review_id FROM reviews`).then((result) => {
                        numberOfReviews = result.rows.length
                    }).then(() => {
                        const queryStr2 = `SELECT * FROM comments WHERE comments.review_id=$1;`
                        return db
                            .query(queryStr2, [review_id])
                    })
                            .then(({ rows }) => {
                                if (review_id > numberOfReviews) return Promise.reject({ status: 404, msg: `Review ${review_id} Not Found`})
                            }).then(() => {
                                if (body.length === 0) {
                                    return Promise.reject({ status: 400, msg: 'Please enter a comment!'})
                                }
                                if (typeof body !== 'string' || typeof author !== 'string') {
                                    return Promise.reject({ status: 400, msg: 'please enter a valid comment!' })
                                }
                                return db
                                    .query(`INSERT INTO comments (body, author, review_id) VALUES ($1, $2, $3) RETURNING*;`, [body, author, review_id])
                                    .then(({ rows }) => {
                                        return rows[0]
                                    })
                            })
            })
        })
}