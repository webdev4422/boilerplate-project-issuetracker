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
      open: true, // Default true
      status_text: req.body.status_text, // Return empty
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
  let queryX = req.query
  let projectName = req.params.project

  // const projectX = await ProjectModel.findOne({
  //   'issues._id': req.query._id.toString(),
  // })

  const projectX = await ProjectModel.aggregate([
    { $match: { 'issues._id': ObjectId('64d7d5249616b631a46c49ed') } },
    // {
    //   $project: {
    //     issues: {
    //       $filter: {
    //         input: '$issues',
    //         as: 'issues',
    //         cond: { $eq: ['$$issues._id', queryX._id] },
    //       },
    //     },
    //     _id: 0,
    //   },
    // },
  ])

  console.log(projectX)

  // db.Store.find(
  //   { 'discounts.name': 'test edit' },
  //   { _id: 0, discounts: { $elemMatch: { name: 'test edit' } } }
  // )
  // db.collection.find({"Students.users.info.name": username})

  // const issueX = await IssueModel.findOne({ _id: queryX._id })
  // console.log(issueX)

  res.end()
  // if (projectX) {
  //   const issueX = await IssueModel.findOne({ _id: queryX._id })
  //   console.log(issueX)
  //   // todo if not find _id then errou
  //   if (queryX) {
  //     // const issueX = await ProjectModel.findOne({ _id: req.body._id.toString() })
  //     // issueX.reported = true
  //     // await issueX.save()
  //     // console.log(`Reported thread id: ${issueX._id}`)
  //     //
  //     res.json({ result: 'successfully updated', _id: queryX._id })
  //   } else {
  //     res.json({ error: 'could not update', _id: queryX._id })
  //     // { error: 'no update field(s) sent', '_id': _id }
  //     // { error: 'could not update', '_id': _id }
  //     // { error: 'missing _id' }.
  //   }

  //   return res.json(projectX.issues)
  // } else if (!projectX) {
  //   res.json("Project doesn't exist")
  // }
}

// delete: /api/thread/:board thread_id=6458d90a153be09f10013a53; delete_password=xxx
const deleteThread = async (req, res) => {
  const threadX = await Thread.findOne({ _id: req.body.thread_id.toString() })
  if (threadX) {
    if (req.body.delete_password === threadX.delete_password) {
      await threadX.deleteOne()
      console.log(`Deleted thread id: ${threadX._id}`)
      res.send('success')
    } else {
      console.log('incorrect password')
      res.send('incorrect password')
    }
  } else {
    console.log(`No thread found`)
    res.send('No thread found')
  }
}

// Create reply var
// const replyX = await Reply.create({
//   text: req.body.text,
//   delete_password: req.body.delete_password,
//   created_on: Date.now(),
//   reported: false,
// })
// console.log(replyX)

module.exports = { postIssue, getIssue, deleteThread, putIssue }
