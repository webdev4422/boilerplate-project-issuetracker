const { IssueModel, ProjectModel } = require('../models/issueModel.js')

// *** POST ISSUE***
// POST /api/issues/apitest?issue_title=titleX&issue_text=textX&created_by=userX
const postIssue = async (req, res) => {
  let projectName = req.params.project // this take value from /api/issues/ANYPROJECT
  // Check required fields
  if (req.body.issue_title && req.body.issue_text && req.body.created_by) {
    // Create issue
    // IMPORTANT! 'new Model()' doesn't create instance in model collection, so use 'Model.create()'
    const issueX = await IssueModel.create({
      // _id automatically added
      issue_title: req.body.issue_title, // Required
      issue_text: req.body.issue_text, // Required
      created_on: Date.now(), // Required
      updated_on: Date.now(), // Required
      created_by: req.body.created_by, // Required
      assigned_to: req.body.assigned_to, // Return empty
      status_text: req.body.status_text, // Return empty
      open: true, // Default true
    })

    // Find project with ASYNC opearation, must use 'await'!
    let projectX = await ProjectModel.findOne({ project: projectName })
    // If project doesn't exists, create one
    if (!projectX) {
      projectX = await ProjectModel.create({ project: projectName })
    }
    // If project exists push issue into this project
    projectX.issues.push(issueX)
    // Save to database
    await projectX.save()
    return res.json(issueX)
  } else {
    return res.json({ error: 'required field(s) missing' })
  }
}

// *** GET ISSUE ***
// GET /api/issues/apitest
const getIssue = async (req, res) => {
  let projectName = req.params.project
  // Get project with all issues
  const projectX = await ProjectModel.findOne({ project: projectName })
  if (projectX) {
    return res.json(projectX.issues)
  } else if (!projectX) {
    return res.json("Project doesn't exist")
  }
}

// *** PUT ISSUE ***
// PUT /api/issues/apitest?issue_title=titleX&issue_text=textX&created_by=userX
const putIssue = async (req, res) => {
  // TODO ISSUE this update only issuemodel document and porjectmodel documenet left unchanged. Thus 2 separate copies of document exists.

  // let queryX = req.query
  // let projectName = req.params.project

  const issueX = await IssueModel.findOne({ _id: req.query._id.toString() })

  if (req.query.issue_title) issueX.issue_title = req.query.issue_title
  if (req.query.issue_text) issueX.issue_text = req.query.issue_text
  if (req.query.created_by) issueX.created_by = req.query.created_by
  if (req.query.assigned_to) issueX.assigned_to = req.query.assigned_to
  if (req.query.status_text) issueX.status_text = req.query.status_text
  if (req.query.open) issueX.open = req.query.open

  // TODO { error: 'no update field(s) sent', '_id': _id }

  // Save to database
  await issueX.save()
  return res.json({ result: 'successfully updated', _id: req.query._id })
}

// delete: /api/thread/:board thread_id=6458d90a153be09f10013a53; delete_password=xxx
const deleteIssue = async (req, res) => {
  // return if not _id provided
  if (!req.body._id) return res.json({ error: 'missing _id' })
  // Find and delete _id
  const issueX = await IssueModel.findOne({ _id: req.body._id.toString() })
  if (issueX) {
    await issueX.deleteOne()
    console.log(`Deleted issue id: ${issueX._id}`)
    return res.json({ result: 'successfully deleted', _id: issueX._id })
  } else {
    return res.json({ error: 'could not delete', _id: req.body._id.toString() })
  }
}

module.exports = { postIssue, getIssue, putIssue, deleteIssue }
