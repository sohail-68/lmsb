const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';

    // Determine folder based on file type or request type
    if (req.body && req.body.type) {
      if (req.body.type === 'courseThumbnail') {
        folder = 'uploads/courses/';
      } else if (req.body.type === 'profileImage') {
        folder = 'uploads/profiles/';
      } else if (req.body.type === 'lectureVideo') {
        
        folder = 'uploads/videos/';
      }
    }

    // Ensure the folder exists
    ensureDirectoryExists(folder);

    // Set the folder path
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter function for both images and videos
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = {
    images: /jpeg|jpg|png|gif/,
    videos: /mp4|mov|avi|mkv|wmv/,
  };

  const fileType = req.body.type === 'lectureVideo' ? allowedFileTypes.videos : allowedFileTypes.images;
  const extname = fileType.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileType.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type! Expected ${req.body.type === 'lectureVideo' ? 'a video' : 'an image'} file.`), false);
  }
};

// Multer instance with size limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: (req, file, cb) => {
      // Allow larger file sizes for videos (100MB for videos, 5MB for images)
      return req.body.type === 'lectureVideo' ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
    },
  },
});

module.exports = upload;
