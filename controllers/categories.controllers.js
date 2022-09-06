const { selectCategories } = require('../models/categories.models')

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.send({ categories });
    })
    .catch((err) => {
        next(err)
    });
}