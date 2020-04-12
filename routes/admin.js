const express     = require('express');
const router      = express.Router();

const mainContriller = require('../controllers/admin');
const isAuth= require('../meddleWere/isAuth');

router.get('/',isAuth,mainContriller.getAdmin);
router.post('/addTrack',mainContriller.postAddTrack);
router.post('/addProject',mainContriller.postAddProject);
router.get('/edit/:pId',isAuth,mainContriller.getEditProject);
router.post('/editPost',isAuth,mainContriller.postEdit);
router.post('/delete',isAuth,mainContriller.postDeleteProject);

module.exports = router;
