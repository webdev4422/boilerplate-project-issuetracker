const { Issue } = require('../models/issueModel.js')

// *** CREATE ISSUE***
// POST: /api/issues/apitest?issue_title=titleX&issue_text=textX&created_by=userX
const createIssue = async (req, res) => {
  // Check required fields
  if (req.body.issue_title && req.body.issue_text && req.body.created_by) {
    // Create issue
    const issueX = await Issue.create({
      // _id automatically added
      issue_title: req.body.issue_title, // Required
      issue_text: req.body.issue_text, // Required
      created_on: Date.now(), // Required
      updated_on: Date.now(), // Required
      created_by: req.body.created_by, // Required
      assigned_to: req.body.assigned_to,
      open: true, // Default true
      status_text: req.body.status_text,
    })
    // Save to database
    const mongoRes = await issueX.save()
    // Response with response object
    return res.json(mongoRes)
  } else {
    res.json({ error: 'required field(s) missing' })
  }
}

// get: /api/threads/:board
// response: // [{"_id":"6456b218ad743174db9b6dd0","text":"testXXX","created_on":"2023-05-06T20:01:28.805Z","bumped_on":"2023-05-06T20:01:28.805Z","replies":[],"replycount":0}]
const viewBoard = async (req, res) => {
  const boardX = await Board.find({ board: req.params.board })
  if (boardX.length == 0) {
    const boardNew = await Board.create({
      board: req.params.board,
      threads: [],
    })
    console.log(`Board created: ${req.params.board}`)
    return res.redirect(303, `/b/${req.params.board}/`)
  }
  console.log(`View threads on board: ${req.params.board}`)
  // Response with array reverse sorted
  res.json(boardX[0].threads.reverse())
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

// put: /api/thread/:board report_id=6458d90a153be09f10013a53
const reportThread = async (req, res) => {
  if (req.body.report_id > 0) {
    const threadX = await Thread.findOne({ _id: req.body.report_id.toString() })
    threadX.reported = true
    await threadX.save()
    console.log(`Reported thread id: ${threadX._id}`)
    res.send('reported')
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

module.exports = { createIssue, viewBoard, deleteThread, reportThread }
