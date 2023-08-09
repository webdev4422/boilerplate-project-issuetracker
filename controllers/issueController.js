const { Issue } = require('../models/issueModel.js')

// post: /api/threads/:board board=boardX; text=XXX; delete_password=aaaa
// response: redirect to /b/:board and list all threads
const createIssue = async (req, res) => {
  // *** CREATE THREAD***
  // Create thread to be pushed on board
  const issueX = await Issue.create({
    // _id
    issue_title: 'Fix error in posting data',
    issue_text: 'When we post data it has an error.',
    created_on: '2017-01-08T06:35:14.240Z',
    updated_on: '2017-01-08T06:35:14.240Z',
    created_by: 'Joe',
    assigned_to: 'Joe',
    open: true,
    status_text: 'In QA',
  })

  return res.json("XXXX")

  // *** CREATE BOARD ***
  //*************************************************************************** */
  // Check if board exists
  const boardX = await Board.find({ board: req.body.board }) // return array
  // If exists -> response with this board
  if (boardX.length > 0) {
    // Update board with thread
    boardX[0].threads.push(threadX)
    await boardX[0].save()
    console.log(`Board found: ${req.body.board}; pushed thread id: ${threadX._id}`)
    // Redirect to get /b/:board
    return res.redirect(303, `/b/${req.body.board}/`)

    // If not exists -> create new board
  } else {
    const boardNew = await Board.create({
      board: req.body.board,
      threads: [threadX],
    })
    console.log(`Board created:${req.body.board}; thread id:${threadX._id}`)
    // Redirect to get /b/:board
    return res.redirect(303, `/b/${req.body.board}/`)
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
