'use strict'

const { postIssue, getIssue, putIssue, deleteIssue } = require('../controllers/issueController.js')

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    // issueController -> getIssue, postIssue, putIssue, deleteIssue
    .post(postIssue)

    .get(getIssue)

    .put(putIssue)

    .delete(deleteIssue)

  // .get(function (req, res) {
  //   let project = req.params.project
  // })
  // .post(function (req, res) {
  //   let project = req.params.project
  // })
  // .put(function (req, res) {
  //   let project = req.params.project
  // })
  // .delete(function (req, res) {
  //   let project = req.params.project
  // })
}
