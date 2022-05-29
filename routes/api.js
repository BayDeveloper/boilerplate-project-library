/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const {
  getLibrary,
  createBook,
  deleteLibrary,
  getOneBook,
  createComment,
  deleteOneBook
} = require("../models/controllers");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(getLibrary)
    .post(createBook)
    .delete(deleteLibrary);

  app
    .route("/api/books/:id")
    .get(getOneBook)
    .post(createComment)
    .delete(deleteOneBook);
};
