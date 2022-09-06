const db = require("../connection");

exports.selectReviewById = (reviewid) => {
    return db
    .query('SELECT * FROM reviews WHERE review_id=$1;', [reviewid])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: `Review ${reviewid} Not Found`})
        } 
           return rows[0];
        })
}

exports.updateReviewById = (reviewid, reviewUpdates) => {
    const { inc_votes } = reviewUpdates;
    if (typeof inc_votes !== 'number') {
        return Promise.reject({ status: 400, msg: 'please enter a number!' })
    }
    return db
        .query(`UPDATE reviews SET votes = votes + $1 WHERE review_id=$2 RETURNING*;`, [inc_votes, reviewid])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: `Review ${reviewid} Not Found`})
            } 
        return rows[0]
        })
}