const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Utility function to create multer configuration
const createMulterConfig = ({
  allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'],
  maxFileSize = 10 * 1024 * 1024, // 10 MB
  maxFileCount = 1,
  uploadPath = 'public'
} = {}) => {
  // Define storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      if (!allowedExtensions.includes(ext)) {
        return cb(new Error(`Invalid file type. Allowed extensions: ${allowedExtensions.join(', ')}`), false);
      }
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });

  // Define file filter and limits
  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed extensions: ${allowedExtensions.join(', ')}`), false);
    }
  };

  const limits = {
    fileSize: maxFileSize,
    files: maxFileCount
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
  });
};

// Function to delete a file
const deleteFile = (filePath, callback) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      return callback(err);
    }
    callback(null, 'File deleted successfully');
  });
};

// Function to delete multiple files
const deleteMultipleFiles = (filePaths, callback) => {
  const unlinkFile = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(`File ${filePath} deleted successfully`);
        }
      });
    });
  };

  // Use Promise.all to delete all files
  Promise.all(filePaths.map(unlinkFile))
    .then((results) => callback(null, results))
    .catch((error) => callback(error));
};

module.exports = { createMulterConfig, deleteFile, deleteMultipleFiles };