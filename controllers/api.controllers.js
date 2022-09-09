const { selectApi } = require('../models/api.models')

exports.getApi = (req, res, next) => {
    const endpoints = selectApi()
    res.status(200).send(endpoints)
}