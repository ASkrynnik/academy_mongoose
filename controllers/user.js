const User = require('../models/user');
const Article = require('../models/article.js');

module.exports = {createUser, updateUser, getUser, deleteUser, getArticles};

async function createUser(req, res, next) {
  try {
    const user = await User.create(req.body);
    res.json(user)
  } catch(e) {
    next(e)
  }
}

async function updateUser(req, res, next) {
  const existingUser = req.existingUser;
  const body = req.body;
  try {
      if (body.firstName) {
        existingUser.firstName = body.firstName;
      }
      if (body.lastName) {
        existingUser.lastName = body.lastName;
      }

      await existingUser.save();
      return res.status(200).json(existingUser);
  } catch (err) {
      console.log(err);
      next(err);
  }
}

async function getUser(req, res, next) {
  const userId = req.params.userId;
  try {
    const existingUser = req.existingUser;
    const articles = await Article.find({owner: userId});

    res.json({existingUser, articles});
  } catch (err) {
      console.log(err);
      next(err);
  }
}

async function deleteUser(req, res, next) {
  const userId = req.params.userId;
  try {
    const deletedUser = await User.findOne({_id: userId});
    await deletedUser.remove()
    await Article.deleteMany({owner: userId});
    res.json(deletedUser)
  } catch (err) {
    console.log(err);
    next(err);
}
}

async function getArticles(req, res, next) {
  const userId = req.params.userId;
  try {
    const articles = await Article.find({owner: userId});
    res.json(articles);
  } catch (err) {
    console.log(err);
    next(err);
}
}