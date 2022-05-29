const Library = require("./library");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const getLibrary = async (req, res) => {
  const books = await Library.find();
  if (!books) {
    res.json("some message if no books are found");
    return;
  }

  var bookshelf = books.map((d) => ({
    _id: d._id,
    title: d.title,
    commentcount: d.comments.length
  }));

  res.status(StatusCodes.OK).json(bookshelf);
};

const createBook = async (req, res) => {
  const title = req.body.title;
  if (!title) {
    badRequest(res, "title");
    return;
  }

  const newBook = await Library.create(req.body);

  if (!newBook) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("something went wrong");
  }

  var infoBook = {
    _id: newBook._id,
    title: newBook.title
  };

  res.status(StatusCodes.CREATED).json(infoBook);
};

const deleteLibrary = async (req, res) => {
  const deleteLibrary = await Library.deleteMany({});
  res.status(StatusCodes.OK).json("complete delete successful");
};

const getOneBook = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    badRequest(res, "id");
    return;
  }
  const book = await Library.findById(id);
  if (!book) {
    res.status(StatusCodes.OK).json("no book exists");
    return;
  }
  var bookInfo = {
    _id: id,
    title: book.title,
    comments: book.comments
  };

  res.status(StatusCodes.OK).json(bookInfo);
};

const createComment = async (req, res) => {
  const id = req.params.id;
  const comment = req.body.comment;

  // if the ID is missing, app routes to /api/books, so any check for that is not done.

  const idValidity = mongoose.Types.ObjectId.isValid(id);
  if (!idValidity) {
    res.status(StatusCodes.BAD_REQUEST).json("invalid id");
    return;
  }

  if (!comment) {
    badRequest(res, "comment");
    return;
  }

  const book = await Library.findByIdAndUpdate(
    { _id: id },
    { $push: { comments: comment } },
    { new: true, runValidators: true }
  );

  if (!book) {
    res.status(StatusCodes.OK).json("no book exists");
    return;
  }

  var bookInfo = {
    _id: id,
    title: book.title,
    comments: book.comments
  };

  res.status(StatusCodes.OK).json(bookInfo);
};

const deleteOneBook = async (req, res) => {
  const id = req.params.id;
  const idValidity = mongoose.Types.ObjectId.isValid(id);
  if (!idValidity) {
    res.status(StatusCodes.BAD_REQUEST).json("invalid id");
    return;
  }

  const book = await Library.findByIdAndDelete(id);

  if (!book) {
    res.status(StatusCodes.OK).json("no book exists");
    return;
  }

  res.status(StatusCodes.OK).json("delete successful");
};

const badRequest = (res, field) => {
  res.status(StatusCodes.OK).json(`missing required field ${field}`);
};

module.exports = {
  getLibrary,
  createBook,
  deleteLibrary,
  getOneBook,
  createComment,
  deleteOneBook
};
