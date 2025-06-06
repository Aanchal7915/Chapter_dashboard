const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory, not disk
const upload = multer({ storage });

const cache = require('../middlewares/cache');
const limiter = require('../middlewares/rateLimiter');
const auth = require('../middlewares/auth');
const controller = require('../controllers/chapterController');

router.use(limiter);

router.get('/', cache, controller.getAllChapters);
router.get('/:id', controller.getChapterById);
router.post('/', auth, upload.single('file'), controller.uploadChapters);

module.exports = router;
