const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const utilError = require('../config/errorHelper');

const articleController = require('../controllers/article');
const checkIfArticleExist = async(req, res, next) => {
    const articleId = req.params.articleId;
    try {
      const existingArticle = await Article.findOne({_id: articleId});
      if (!existingArticle) {
        throw utilError.badRequest('Article not exists');
      }
      req.existingArticle = existingArticle;
    } catch (err) {
      console.log(err);
      next(err);
    }
    next();
}

router.post('/', articleController.createArticle);
router.put('/:articleId', checkIfArticleExist, articleController.updateArticle);
router.get('/', articleController.getArticles);
router.delete('/:articleId', checkIfArticleExist, articleController.deleteArticle)

module.exports = router;