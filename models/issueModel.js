const mongoose = require('mongoose')

// Create issue schema
const issueSchema = new mongoose.Schema({
  // _id // Mongoose add id property by default https://mongoosejs.com/docs/guide.html#_id
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date, default: Date.now, required: true },
  updated_on: { type: Date, default: Date.now, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: '', required: false },
  open: { type: Boolean, default: true },
  status_text: { type: String, default: '', required: false },
})

// Create model wrapper on schema
const Issue = mongoose.model('Issue', issueSchema)

// Export models
module.exports = { Issue }
