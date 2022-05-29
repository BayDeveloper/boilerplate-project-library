/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { ObjectId } = require("mongoose").Types;

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("Routing tests", function () {
    var validId;
    var invalidId = new ObjectId();

    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .set("content-type", "application/x-www-form-urlencoded")
            .send({
              title: "A test book title"
            })
            .end((err, res) => {
              if (err) {
                done(error);
              } else {
                assert.equal(res.status, 201);
                assert.property(res.body, "_id", "_id should be returned");
                assert.property(res.body, "title", "title should be returned");
                validId = res.body._id;
                done();
              }
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .set("content-type", "application/x-www-form-urlencoded")
            .send({})
            .end((err, res) => {
              if (err) {
                done(err);
              } else {
                assert.equal(res.status, 200);
                assert.equal(res.text, '"missing required field title"');
                done();
              }
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 200);
              assert.isArray(res.body, "response should be an array");
              assert.property(
                res.body[0],
                "commentcount",
                "Books in array should contain commentcount"
              );
              assert.property(
                res.body[0],
                "title",
                "Books in array should contain title"
              );
              assert.property(
                res.body[0],
                "_id",
                "Books in array should contain _id"
              );
              done();
            }
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get(`/api/books/${invalidId}`)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 200);
              assert.isString(res.body, "response should be a string");
              assert.equal(res.text, '"no book exists"');
              done();
            }
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get(`/api/books/${validId}`)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 200);
              done();
            }
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post(`/api/books/${validId}`)
            .set("content-type", "application/x-www-form-urlencoded")
            .send({
              comment: "test comment"
            })
            .end((err, res) => {
              if (err) {
                done(err);
              } else {
                assert.equal(res.status, 200);
                assert.property(
                  res.body,
                  "_id",
                  "the object should contain _id"
                );
                assert.property(
                  res.body,
                  "title",
                  "the object should contain title"
                );
                assert.property(
                  res.body,
                  "comments",
                  "comments should be a property in the object"
                );
                assert.isArray(
                  res.body.comments,
                  "the comments property should be an array"
                );
                assert.isString(
                  res.body.comments[0],
                  "the comment should be a string"
                );
                assert.equal(res.body.comments[0], "test comment");
                done();
              }
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .post(`/api/books/${validId}`)
            .set("content-type", "application/x-www-form-urlencoded")
            .send({})
            .end((err, res) => {
              if (err) {
                done(err);
              } else {
                assert.equal(res.status, 200);
                assert.isString(res.body, "the return value must be a string");
                assert.equal(res.body, "missing required field comment");
                done();
              }
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post(`/api/books/${invalidId}`)
            .set("content-type", "application/x-www-form-urlencoded")
            .send({
              comment: "another test comment"
            })
            .end((err, res) => {
              if (err) {
                done(err);
              } else {
                assert.equal(res.status, 200);
                assert.isString(res.body, "the return value must be a string");
                assert.equal(res.body, "no book exists");
                done();
              }
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .delete(`/api/books/${validId}`)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 200);
              assert.isString(res.body, "the return value must be a string");
              assert.equal(res.body, "delete successful");
              done();
            }
          });
      });

      test("Test DELETE /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .delete(`/api/books/${invalidId}`)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 200);
              assert.isString(res.body, "the return value must be a string");
              assert.equal(res.body, "no book exists");
              done();
            }
          });
      });
    });
  });
});
