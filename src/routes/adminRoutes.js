const express = require("express");
const { authorize } = require("../middleware/authorization");
const { createMulterConfig } = require('../utils/fileUploadOnLocal');
const teacherController = require("../controllers/admin/teacher.controller");

// Create multer instance
const upload = createMulterConfig({
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'], // Customize as needed
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    maxFileCount: 1,
    uploadPath: 'public/adminImages'
});

// upload.single('profile') // for single file
// upload.array('profile', 5) // for multiple file and also update "maxFileCount" in "createMulterConfig"

const router = express.Router();

// Define routes
router.post('/teacher', authorize(['admin']), upload.single('profile'), teacherController.createTeacherController);
router.get('/teacher', authorize(['admin']), upload.none(), teacherController.getAllTeachersController);
router.get('/teacher/:id', authorize(['admin']), teacherController.getTeacherByIdController);
router.put('/teacher/:id', authorize(['admin']), upload.single('profile'), teacherController.updateTeacherByIdController);
router.delete('/teacher/:id', authorize(['admin']), teacherController.deleteTeacherByIdController);

module.exports = router;
