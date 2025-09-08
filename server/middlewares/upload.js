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

    if (req.body && req.body.type) {
      if (req.body.type === 'courseThumbnail') {
        folder = 'uploads/courses/';
      } else if (req.body.type === 'profileImage') {
        folder = 'uploads/profiles/';
      } else if (req.body.type === 'lectureVideo') {
        folder = 'uploads/videos/';
      }
    }

    ensureDirectoryExists(folder);

    console.log(`Uploading to folder: ${folder}`);  // 🔍 Log destination folder

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    console.log("dddd,",file);
    
    const uniqueName = Date.now() + path.extname(file.originalname);

    console.log(`Original filename: ${file.originalname}`); // 🔍 Original name
    console.log(`Saved as: ${uniqueName}`);                 // 🔍 Final saved name

    cb(null, uniqueName);
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

// ❌ FIX: fileSize inside limits must be number, not function
// Default to max 100MB, you can dynamically limit per route if needed
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // Max limit (handled per type in route)
  },
});

module.exports = upload;
