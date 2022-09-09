const { selectApi } = require('../models/api.models')

exports.getApi = (res, req, next) => {
    return selectApi()
}