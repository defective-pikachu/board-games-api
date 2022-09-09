const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");


exports.selectReviews = (sort_by = 'created_at', order = 'DESC', category) => {

    const validColumns = ['name', 'title', 'review_id', 'category', 'review_img_url', 'created_at', 'votes', 'designer', 'comment_count']
    const validOrder = ['DESC', 'ASC']
    if (!validColumns.includes(sort_by)) {
        return Promise.reject({status: 400, msg: 'Bad Request' })
    }
    if(!validOrder.includes(order.toUpperCase())) {
        return Promise.reject({status: 400, msg: 'please enter either "asc" or "desc" :)'})
    }

    let queryStr = `SELECT reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.review_body, reviews.category, reviews.created_at, reviews.votes, reviews.review_id, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id`
    
    const categoryArray = []
            
    if (category) {
        categoryArray.push(category)
            queryStr += ' WHERE reviews.category = $1'
    }
            
    queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`
            
    return db.query(queryStr, categoryArray)
        .then(({ rows }) => {
            return rows;
        })
}

exports.selectReviewById = (reviewid) => {
    return db
    .query(`SELECT reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.review_body, reviews.category, reviews.created_at, reviews.votes, reviews.review_id, COUNT(*)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id=$1 GROUP BY reviews.review_id;`, [reviewid])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: `Review ${reviewid} Not Found`})
        } 
            return rows[0];
        })
}

exports.updateReviewById = (reviewid, reviewUpdates) => {
    const { inc_votes } = reviewUpdates;
    if (inc_votes === undefined) {
        return Promise.reject({ status: 400, msg: 'you need an inc_votes key!' })
    } 
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