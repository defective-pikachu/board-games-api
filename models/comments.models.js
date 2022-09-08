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