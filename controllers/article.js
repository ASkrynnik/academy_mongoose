const mongoose = require('mongoose');
const _ = require('lodash');
const Article = require('../models/article.js');
const errorHelper = require('../config/errorHelper');
const user = require('../models/user.js');

module.exports = {createArticle, updateArticle, getArticles, deleteArticle};

async function createArticle(req, res, next) {
  try {
    const fields = [
      'title',
      'description',
      'owner',
    ];

    const body = req.body;
    const data = _.pick(body, fields);

    if(!data.owner || !mongoose.isValidObjectId(data.owner)) {
      return next(errorHelper.badRequest('article.owner_not_objectId'))
    }
    const ownerExists = await user.findById(data.owner);
    if(!ownerExists) {
      return next(errorHelper.badRequest('article.owner_not_exists'))
    }

    await user.findOneAndUpdate({"_id": data.owner}, [
      {
        $set: {
          numberOfArticles: {
            $add: ['$numberOfArticles', 1]
          }
        }
      }
    ])
    const article = new Article(data);
    await article.save();
    return res.status(201).json(article)

  } catch(e) {
    next(e)
  }
}

async function updateArticle(req, res, next) {
  const body = req.body;
  const existingArticle = req.existingArticle;

  try {
    if (body.title) {
      existingArticle.title = body.title;
    }

    if (body.subtitle) {
      existingArticle.subtitle = body.subtitle;
    }

    if (body.description) {
      existingArticle.description = body.description;
    }

    if (body.owner) {
      const existingUser = await user.findOne({_id: body.owner})
      if (!existingUser) {
        throw errorHelper.notFound('User not exists');
      }
      await user.findOneAndUpdate({"_id": existingArticle.owner}, [
        {
          $set: {
            numberOfArticles: {
              $subtract: ['$numberOfArticles', 1]
            }
          }
        }
      ])

      await user.findOneAndUpdate({"_id": body.owner}, [
        {
          $set: {
            numberOfArticles: {
              $add: ['$numberOfArticles', 1]
            }
          }
        }
      ])
      existingArticle.owner = body.owner;
    }

    if (body.category) {
      if(body.category !== 'sport' || body.category !== 'games' || body.category !== 'history') {
        throw errorHelper.badRequest('Category must be one of this: sport, games, history');
      }
      existingArticle.category = body.category;
    }

    await existingArticle.save();
    return res.status(200).json(existingArticle);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function getArticles(req, res, next) {
  try {
    const result = await Article.find(req.query)
      .populate('owner')

    return res.status(200).json(result);
  } catch(e) {
    next(e)
  }
}

async function deleteArticle(req, res, next) {
  const existingArticle = req.existingArticle;
  try {
    const userId = existingArticle.owner;
    const deletedArticle = existingArticle
    await existingArticle.remove();
    await user.findOneAndUpdate({"_id": userId}, [
      {
        $set: {
          numberOfArticles: {
            $subtract: ['$numberOfArticles', 1]
          }
        }
      }
    ])
    res.json(deletedArticle)
  } catch (err) {
    console.log(err);
    next(err);
  }
}