/*
    User routes / Auth
    host + / api/auth
*/

const { Router } = require('express');
const router = Router();
const { createUser, userLogin, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post(
    '/new',
    // Middlewares 
    [
        check('name', 'The name is mandatory').not().isEmpty(),
        check('name', 'The name must have at least 6 characters').isLength({ min: 6 }),
        check('email', 'The email is mandatory').isEmail(),
        check('password', 'The password is mandatory and at least 6 characters.').isLength({ min: 6 }),
        validateFields
    ],
    createUser);

router.post(
    '/',
    [
        check('email', 'The email is mandatory').isEmail(),
        check('password', 'The password is mandatory and at least 6 characters.').isLength({ min: 6 }),
        validateFields
    ]
    ,
    userLogin);

router.get(
    '/renew',
    validateJWT,
    renewToken);

module.exports = router;