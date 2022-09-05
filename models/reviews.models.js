const db = require("../connection");

exports.selectReviewById = (reviewid) => {
    return db
    .query('SELECT * FROM reviews WHERE review_id=$1;', [reviewid])
    .then(({ rows }) => {
           return rows[0];
        })
}