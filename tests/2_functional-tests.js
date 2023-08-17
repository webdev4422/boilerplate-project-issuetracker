const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)

suite('Functional Tests', function () {
  suite('Integration tests with chai-http', function () {
    // *** POST REQUEST ***
    // #1
    test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
          issue_title: 'titleXXX',
          issue_text: 'textXXX',
          created_by: 'userXXX',
          assigned_to: 'assignXXX',
          status_text: 'statusXXX',
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.json)
          assert.equal(res.body.issue_title, 'titleXXX')
          assert.equal(res.body.issue_text, 'textXXX')
          assert.equal(res.body.created_by, 'userXXX')
          assert.equal(res.body.assigned_to, 'assignXXX')
          assert.equal(res.body.status_text, 'statusXXX')
        })
      done()
    })
    // #2
    test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
          issue_title: 'titleXXX',
          issue_text: 'textXXX',
          created_by: 'userXXX',
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.json)
          assert.equal(res.body.issue_title, 'titleXXX')
          assert.equal(res.body.issue_text, 'textXXX')
          assert.equal(res.body.created_by, 'userXXX')
        })
      done()
    })
    // #3
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({
          assigned_to: 'assignXXX',
          status_text: 'statusXXX',
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.json)
          assert.equal(res.body.error, 'required field(s) missing')
        })
      done()
    })
    // *** GET REQUEST ***
    // #1
    test('View issues on a project: GET request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/apitest')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.array)
        })
      done()
    })
    // #2
    test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/apitest?open=false')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.array)
          assert.equal(res.body[0].open, false)
        })
      done()
    })
    // #3
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/apitest?open=false&issue_title=newTitleXXX')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.array)
          assert.equal(res.body[0].open, false)
          assert.equal(res.body[0].issue_title, 'newTitleXXX')
        })
      done()
    })
    // *** PUT REQUEST ***
    // #1
    test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/apitest')
        .send({
          _id: '64de0acfd28eb3b3f8bf61d0',
          issue_title: 'newTitleXXX',
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.result, 'successfully updated')
        })
      done()
    })
    // #2
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/apitest')
        .send({
          _id: '64de0acfd28eb3b3f8bf61d0',
          issue_title: 'newTitleXXX',
          issue_text: 'newTextXXX',
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.result, 'successfully updated')
        })
      done()
    })
    // #3
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/apitest')
        .send({
          issue_title: 'newTitleXXX',
          issue_text: 'newTextXXX',
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'missing _id')
        })
      done()
    })
    // #4
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/apitest')
        .send({
          _id: '64de0acfd28eb3b3f8bf61d0',
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'no update field(s) sent')
        })
      done()
    })
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/apitest')
        .send({
          _id: '64de0acfd28eb3b3f8bf61dasd0',
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'could not update')
        })
      done()
    })
    // *** DELETE REQUEST ***
    // #1
    test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/apitest')
        .send({
          _id: '64de1370c9c813d0b82601de',
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.result, 'successfully deleted')
        })
      done()
    })
    // #2
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/apitest')
        .send({
          _id: '64de0dda597ae52c23cb85bd',
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'could not delete')
        })
      done()
    })
    // #3
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/apitest')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'missing _id')
        })
      done()
    })
  })
})
