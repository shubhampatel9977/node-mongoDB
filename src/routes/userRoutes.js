const express = require("express");
const { authorize } = require("../middleware/authorization");
const { createMulterConfig } = require('../utils/fileUploadOnLocal');
const studentController = require("../controllers/studentController");

// Create multer instance
const upload = createMulterConfig({
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'], // Customize as needed
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    maxFileCount: 1,
    uploadPath: 'public/userImages'
});

// upload.single('profile') // for single file
// upload.array('profile', 5) // for multiple file and also update "maxFileCount" in "createMulterConfig"

const router = express.Router();

// Define routes
router.post('/student', authorize(['user']), upload.single('profile'), studentController.createStudentController);
router.get('/student', authorize(['user']), upload.none(), studentController.getAllStudentsController);
router.get('/student/:id', authorize(['user']), studentController.getStudentByIdController);
router.put('/student/:id', authorize(['user']), upload.single('profile'), studentController.updateStudentByIdController);
router.delete('/student/:id', authorize(['user']), studentController.deleteStudentByIdController);

module.exports = router;
