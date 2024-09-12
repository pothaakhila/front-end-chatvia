const multer = require('multer');
const path = require('path');

// Configure storage and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
  },
});

// File filter for accepting only specific types
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'file' || file.fieldname === 'image') {
    cb(null, true); // Accept file
  } else {
    cb(new multer.MulterError('Unexpected field'), false); // Reject file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
