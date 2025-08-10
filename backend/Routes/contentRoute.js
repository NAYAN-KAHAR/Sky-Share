import { Router } from 'express';
import textPostController from '../Controllers/contentController/textController/textPost.js';
import textGetController from '../Controllers/contentController/textController/textGet.js';
import deleteFilesController from '../Controllers/contentController/textController/deleteText.js';

import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';

const router = Router();

// Ensure the upload directory exists
const uploadDir = path.resolve('./upload');
fs.ensureDirSync(uploadDir);

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/textpost', upload.single('file'), textPostController);
router.get('/text', textGetController);
router.post('/deleteFiles', deleteFilesController);

export default router;