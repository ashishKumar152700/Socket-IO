import express from 'express';
import upload from '../utils/upload.js'; // Adjust the path if needed
import Image from '../model/Image.model.js';
import fs from 'fs';

const router = express.Router();



router.get('/get', async (req, res) => {
  try {
    const images = await Image.find();
    // Map each image to include its URL
    const imagesWithUrls = images.map(image => ({
      _id: image._id,
      originalName: image.originalName,
      filename: image.filename,
      uploadDate: image.uploadDate,
      imageUrl: `/uploads/${image.filename}` // Assuming images are served from the /uploads directory
    }));
    
    res.status(200).json(imagesWithUrls);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching images' });
  }
});



// Route for single file upload
router.post('/', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file selected' });
    }

    const { originalName,descriptions } = req.body;

    const newImage = new Image({
      originalName,
      filename: req.file.filename,
      descriptions
      
    });
    console.log(newImage);

    try {
      const savedImage = await newImage.save();
      res.status(200).json({ message: 'File uploaded successfully', image: savedImage });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error saving image metadata' });
    }
  });
});

// Route for multiple file uploads
  router.post('/multiple', (req, res) => {
    upload.array('files')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files selected' });
      }

      const { originalNames } = req.body;
      const filesCount = req.files.length;


      // if (!Array.isArray(originalNames) || originalNames.length !== filesCount ||
      //     !Array.isArray(descriptions) || descriptions.length !== filesCount) {
      //   return res.status(400).json({ error: 'Original names, descriptions, and files count mismatch' });
      // }

      try {
        console.log('Original Names:', originalNames);
        // console.log('Descriptions:', descriptions);
        console.log('Files:', req.files);
  
        const images = await Promise.all(req.files.map((file, index) => {
          const newImage = new Image({
            originalName: originalNames[index],
            filename: file.filename,
          });
        
          return newImage.save();
        }));
        res.status(200).json({ message: 'Files uploaded successfully', images });

      } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: 'Error saving images metadata' });
      }
    });
  });


// Route for deleting a single image
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const filename = image.filename;
    await Image.findByIdAndDelete(id);
    fs.unlinkSync(`uploads/${filename}`);

    res.status(200).json({ message: 'Image deleted successfully', image });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting image' });
  }
});

export default router;
