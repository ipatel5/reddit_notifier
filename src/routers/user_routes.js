const express = require('express');
const router = new express.Router();
const schedule = require('node-schedule');
const UserController = require('../controllers/user_conroller');

/**
 * * POST method to create a new user
 * @path
 * @param {String}  firstName - First name of the user
 * @param {String}  lastName - Last name of the user
 * @param {Array}  favSubReddits - list of fav SubReddits of the user
 * @param {String}  email - Email of the user
 * @returns {Promise}
 */
router.post('/users/createUser', UserController.createUser);

/**
 * GET all users
 * @returns {Promise}
 */
router.get('/users', UserController.getAllUsers);

/**
 * Update user profile
 */
router.patch('/user/:id', UserController.updateUser);

/**
 * Update user emailNotification
 */
router.patch('/user/updateNotification/:id', UserController.updateEmailNotifications);


/**
 * * POST method to create a new Org Admin user
 * @path
 * @param {array}  favSubReddits 
 * @returns {Promise}
 */
router.post('/user/:id/addSubReddits', UserController.addSubReddits);

/**
 * Update user subReddits
 */
router.patch('/user/:id/updateSubReddits', UserController.updateSubReddits);


module.exports = router;
