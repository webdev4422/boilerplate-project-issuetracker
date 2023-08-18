const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const { IssueModel, ProjectModel } = require('../models/issueModel.js')

// *** POST ISSUE ***
// POST /api/issues/apitest Form Encoded: issue_title=titleX&issue_text=textX&created_by=userX
const postIssue = async (req, res) => {
  let projectName = req.params.project // this take value from /api/issues/ANYPROJECT

  // Use destructuring assignment to pull all fields from body object
  let reqBody = req.body
  const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = reqBody

  // Use try...catch block to handle errors for async operations
  try {
    // Check required fields
    if (!issue_title || !issue_text || !created_by)
      return res.json({ error: 'required field(s) missing' })

    // Create issue
    // CUATION ! use either save() or create(), but not both, because it's duplicate https://stackoverflow.com/questions/38290684/mongoose-save-vs-insert-vs-create
    const issueX = new IssueModel({
      // _id automatically added
      issue_title: issue_title, // Required
      issue_text: issue_text, // Required
      created_by: created_by, // Required
      assigned_to: assigned_to, // Return empty
      status_text: status_text, // Return empty
      open: true, // Default true
      created_on: new Date(), // Required
      updated_on: new Date(), // Required
    })

    // Find project with ASYNC opearation, must use 'await'!
    let projectX = await ProjectModel.findOne({ project_name: projectName })

    // If project doesn't exists, create one
    if (!projectX) projectX = await ProjectModel.create({ project_name: projectName })

    // If project exists push issue into this project
    projectX.issues.push(issueX)

    // Save to database
    await projectX.save()
    return res.json(issueX)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

// *** GET ISSUE ***
// GET /api/issues/apitest?open=false&issue_title=titleX&issue_text=textX
const getIssue = async (req, res) => {
  let projectName = req.params.project
  let reqQuery = req.query

  try {
    const projectX = await ProjectModel.findOne({ project_name: projectName })

    if (!projectX) return res.json("Project doesn't exist")

    let issuesX = projectX.issues

    // Filtering issues
    Object.keys(reqQuery).forEach((field) => {
      const filterValue = reqQuery[field]
      issuesX = issuesX.filter((issue) => {
        return issue[field].toString().toLowerCase() === filterValue.toString().toLowerCase()
      })
    })

    return res.json(issuesX)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

// *** PUT ISSUE ***
// PUT /api/issues/apitest Form Encoded: issue_title=titleX&issue_text=textX&created_by=userX
const putIssue = async (req, res) => {
  let projectName = req.params.project
  const reqBody = req.body
  const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = reqBody

  try {
    if (!_id) return res.json({ error: 'missing _id' })

    if (!ObjectId.isValid(_id)) return res.json({ error: 'could not update', _id: _id })

    if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open)
      return res.json({ error: 'no update field(s) sent', _id: _id })

    // Find project
    const projectX = await ProjectModel.findOne({ project_name: projectName })

    // FILTER current issue with JS find() native method
    const issueX = projectX.issues.find((issue) => issue['_id'].toString() === _id)

    if (!issueX) return res.json({ error: 'could not update', _id: _id })

    // Create object to update current issue, keep same feilds if no query exists, because they will be overwritten
    const updateObj = {
      _id: issueX._id.toString(),
      issue_title: issue_title || issueX.issue_title,
      issue_text: issue_text || issueX.issue_text,
      created_by: created_by || issueX.created_by,
      assigned_to: assigned_to || issueX.assigned_to,
      status_text: status_text || issueX.status_text,
      open: open || issueX.open,
      created_on: issueX.created_on,
      updated_on: new Date(),
    }

    const findOneAndUpdate = await ProjectModel.findOneAndUpdate(
      { 'issues._id': _id },
      { $set: { 'issues.$': updateObj } },
      { new: true }
    )
    // Log updated issue using find functionality
    // console.log(findOneAndUpdate.issues.find((issue) => issue['_id'].toString() === _id))

    if (!findOneAndUpdate) return res.json({ error: 'could not update', _id: _id })

    return res.json({ result: 'successfully updated', _id: _id })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

// *** DELETE ISSUE ***
// DELETE /api/issues/apitest Form Encoded: _id=64ddeeeb5977467f332b2f7a
const deleteIssue = async (req, res) => {
  let projectName = req.params.project
  const { _id } = req.body

  try {
    if (!req.body._id) return res.json({ error: 'missing _id' })
    if (!ObjectId.isValid(_id)) return res.json({ error: 'could not delete', _id: _id })

    // Delete (update with $pull) https://dev.to/paulasantamaria/mongodb-animated-adding-and-removing-elements-from-arrays-50cl
    const confirmDelete = await ProjectModel.updateOne(
      { 'issues._id': _id },
      { $pull: { issues: { _id: _id } } }
    )
    // console.log(confirmDelete.matchedCount)
    if (!confirmDelete.matchedCount) return res.json({ error: 'could not delete', _id: _id })

    return res.json({ result: 'successfully deleted', _id: _id })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { postIssue, getIssue, putIssue, deleteIssue }
