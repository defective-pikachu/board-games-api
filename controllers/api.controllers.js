const { selectApi } = require('../models/api.models')

exports.getApi = (res, req, next) => {
    const endpoints = selectApi()
    res.status(200).send(endpoints)
}