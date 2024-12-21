const express = require('express');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const router = express.Router();


router.use(fileUpload());

router.post('/upload', async (req, res) => {
  try {
    const { id } = req.body; 
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const image = req.files.image;

    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const fileName = `${id}.jpg`;
    const filePath = path.join(uploadDir, fileName);

    await image.mv(filePath);

    res.status(201).json({
      message: 'Image uploaded successfully',
      filePath: `/uploads/${fileName}`,
      id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred during upload' });
  }
});

router.get('/image/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
   
    const filePath = path.join(__dirname, '../uploads', `${id}.jpg`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the image' });
  }
});

module.exports = router;
