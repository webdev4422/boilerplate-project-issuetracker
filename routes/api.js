'use strict'

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project
      res.json('ok')
    })

    .post(function (req, res) {
      let project = req.params.project
    })

    .put(function (req, res) {
      let project = req.params.project
    })

    .delete(function (req, res) {
      let project = req.params.project
    })
}
