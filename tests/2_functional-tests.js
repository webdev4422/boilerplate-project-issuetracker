const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)

suite('Functional Tests', function () {
  /*

View issues on a project: GET request to /api/issues/{project}
View issues on a project with one filter: GET request to /api/issues/{project}
View issues on a project with multiple filters: GET request to /api/issues/{project}
Update one field on an issue: PUT request to /api/issues/{project}
Update multiple fields on an issue: PUT request to /api/issues/{project}
Update an issue with missing _id: PUT request to /api/issues/{project}
Update an issue with no fields to update: PUT request to /api/issues/{project}
Update an issue with an invalid _id: PUT request to /api/issues/{project}
Delete an issue: DELETE request to /api/issues/{project}
Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
Delete an issue with missing _id: DELETE request to /api/issues/{project}
*/
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
  // // #1
  // test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
  //   chai
  //     .request(server)
  //     .keepOpen()
  //     .post('/api/issues/apitest')
  //     .send({
  //       assigned_to: 'assignXXX',
  //       status_text: 'statusXXX',
  //     })
  //     .end((err, res) => {
  //       assert.equal(res.status, 200)
  //       assert.equal(res.json)
  //       assert.equal(res.body.error, 'required field(s) missing')
  //     })
  //   done()
  // })
})
