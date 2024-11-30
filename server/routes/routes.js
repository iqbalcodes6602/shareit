import express from 'express';
import upload from '../utils/upload.js';
import {
    uploadImage,
    getImage,
    validateFilePassword
} from '../controller/image-controller.js';
import File from '../models/file.js';

const router = express.Router();


router.post('/upload', upload.single('file'), uploadImage);
router.get('/file/:encryptedFileName', getImage);
router.post('/validate-password/:fileId', validateFilePassword);

router.get('/files', async (req, res) => {
    try {
        const files = await File.find({}, 'name _id');
        res.status(200).json(files);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});


export default router;