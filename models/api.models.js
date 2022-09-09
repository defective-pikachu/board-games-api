const endpoints = require('../endpoints.json')

exports.selectApi = () => {
    const endpoints = endpoints
    res.status(200).send({endpoints})
 };