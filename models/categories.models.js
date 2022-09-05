const db = require("../connection");

exports.selectCategories = () => {
   let queryStr = `SELECT * FROM categories`
    return db.query(queryStr)
    .then(({ rows }) => {
        return rows;
    });
};