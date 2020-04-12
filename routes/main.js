const express     = require('express');
const router      = express.Router();

const mainContriller = require('../controllers/main');

router.get('/',mainContriller.getHome);
router.get('/projects',mainContriller.getHome);
router.get('/aboutme',mainContriller.getAboutme);
router.get('/contactme',mainContriller.getContactMe);
router.get('/track/:track',mainContriller.getTrack);


module.exports = router;
