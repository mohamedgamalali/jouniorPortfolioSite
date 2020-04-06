const express     = require('express');
const router      = express.Router();

const mainContriller = require('../controllers/admin');
const isAuth= require('../meddleWere/isAuth');

router.get('/',isAuth,mainContriller.getAdmin);
router.post('/addTrack',mainContriller.postAddTrack);
router.post('/addProject',mainContriller.postAddProject);

module.exports = router;
