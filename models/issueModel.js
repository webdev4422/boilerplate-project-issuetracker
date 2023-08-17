const mongoose = require('mongoose')
// const { Schema } = mongoose

// Create issue schema
const issueSchema = new mongoose.Schema({
  // _id // Mongoose add id property by default https://mongoosejs.com/docs/guide.html#_id
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: '', required: false },
  status_text: { type: String, default: '', required: false },
  open: { type: Boolean, default: true },
  created_on: { type: Date, default: Date.now, required: true },
  updated_on: { type: Date, default: Date.now, required: true },
})
// Create model wrapper on schema
const IssueModel = mongoose.model('IssueModel', issueSchema)

// Create project schema
const projectSchema = new mongoose.Schema({
  project_name: { type: String, required: true, unique: true, dropDups: true },
  issues: [issueSchema],
  // issues: [{ type: Schema.Types.ObjectId, ref: 'IssueModel' }],
})
// Create model wrapper on schema
const ProjectModel = mongoose.model('ProjectModel', projectSchema)

// Export models
module.exports = { IssueModel, ProjectModel }
