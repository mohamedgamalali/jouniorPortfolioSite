const express     = require('express');
const router      = express.Router();

const authController = require('../controllers/auth');
const isNotAuth= require('../meddleWere/isNotAuth');
const isAuth= require('../meddleWere/isAuth');


router.get('/login',isNotAuth,authController.getLogin);
router.post('/login',isNotAuth,authController.postLogin);
router.get('/logOut',isAuth,authController.getlogOut);

module.exports = router;