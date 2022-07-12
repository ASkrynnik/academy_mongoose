const express = require('express');
const router = express.Router();
const User = require('../models/user');
const utilError = require('../config/errorHelper');

const userController = require('../controllers/user');
const checkIfUserExist = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const existingUser = await User.findOne({_id: userId})
        if(!existingUser) {
            throw utilError.badRequest('User not exists');
        }
        req.existingUser = existingUser;
    } catch (err) {
        console.log(err);
        next(err);
      }
    next();
}

router.post('/', userController.createUser);
router.put('/:userId', checkIfUserExist, userController.updateUser);
router.get('/:userId', checkIfUserExist, userController.getUser);
router.delete('/:userId', checkIfUserExist, userController.deleteUser)
router.get('/:userId/articles', checkIfUserExist, userController.getArticles)

module.exports = router;