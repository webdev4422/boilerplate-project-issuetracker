'use strict'
const {
  postIssue,
  // viewBoard,
  // deleteThread,
  // reportThread,
} = require('../controllers/issueController.js')

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project
    })

    // .post(function (req, res) {
    //   let project = req.params.project
    // })

    .post(postIssue)

    .put(function (req, res) {
      let project = req.params.project
    })

    .delete(function (req, res) {
      let project = req.params.project
    })
}
