const studentValidation = require("../validations/studentValidation");
const studentModel = require("../models/student.model");
const { deleteFile } = require("../utils/fileUploadOnLocal");
const { ApiSuccess, ApiError } = require("../utils/ApiResponse");

const createStudentController = async (req, res) => {
  try {
    // If getting single file then use this function
    const file = req.file;

    if (!file) {
      return ApiError(res, 400, "No Profile uploaded or invalid file type.");
    }

    // If getting multiple file then use this function
    // const files = req.files;

    // if (!files || files.length === 0) {
    //   return ApiError(res, 400, "No Files uploaded or invalid file types.");
    // }

    // Check Validation
    const { error, value } = studentValidation.studentSchema.validate(req.body);
    if (error)
      return ApiError(res, 400, error.details[0].message);

    // add file path
    value.profile = file?.path

    // Create Student
    const addStudent = new studentModel(value);
    await addStudent.save();

    return ApiSuccess(res, 201, true, "Student add successfully");

  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const getAllStudentsController = async (req, res) => {
  try {
    // const userId = req.userId   // Login user id get in token

    // Check Validation
    const { error, value } = studentValidation.studentPagination.validate(req.query);
    if (error)
      return ApiError(res, 400, error.details[0].message);

    const { page = 1, limit = 10, name = '' } = value;
    const offset = (page - 1) * limit;

    // Create a filter object for the search query
    const filter = name ? { name: new RegExp(name, 'i') } : {};

    // Get all students
    const totalStudents = await studentModel.countDocuments(filter);
    const students = await studentModel.find(filter).skip(offset).limit(limit);

    const data = {
      currentPage: page,
      totalPage: Math.ceil(totalStudents / limit), // Calculate total number of pages
      totalCount: totalStudents,
      studentsData: students,
    }
    return ApiSuccess(res, 200, true, "Get All Students Data", data);

  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const getStudentByIdController = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = studentValidation.studentIdSchema.validate(req.params);
    if (error)
      return ApiError(res, 400, error.details[0].message);

    // Get student by id
    const studentData = await studentModel.findById(value.id);

    if (studentData) {
      return ApiSuccess(res, 200, true, "Get student data", studentData);
    } else {
      return ApiError(res, 400, "Student not found");
    }
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const updateStudentByIdController = async (req, res) => {
  try {
    // Check Validation Param
    const { error: idError, value: idValue } = studentValidation.studentIdSchema.validate(req.params);
    if (idError)
      return ApiError(res, 400, idError.details[0].message);

    // Check Validation Body
    const { error: bodyError, value: bodyValue } = studentValidation.studentSchema.validate(req.body);
    if (bodyError)
      return ApiError(res, 400, bodyError.details[0].message);

    // If getting single file then use this function
    const file = req.file;

    if (file) {

      // Get student by id
      const studentData = await studentModel.findById(idValue.id);

      // delete exist file path
      deleteFile(studentData?.profile, (err, data) => {
        if (err) {
          console.log('Error file deleting');
        }
      })

      // update new file path
      bodyValue.profile = file?.path
    }

    // Find student and update
    const studentUpdateData = await studentModel.findByIdAndUpdate(idValue.id, bodyValue);

    if (studentUpdateData) {
      return ApiSuccess(res, 200, true, "Student update successfully", studentUpdateData);
    } else {
      return ApiError(res, 400, "Student not found");
    }
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const deleteStudentByIdController = async (req, res) => {
  try {
    // Check Validation Param
    const { error, value } = studentValidation.studentIdSchema.validate(req.params);
    if (error)
      return ApiError(res, 400, error.details[0].message);

    // Find and delete student
    const studentData = await studentModel.findByIdAndDelete(value.id);

    if (studentData) {

      // delete exist file path
      deleteFile(studentData?.profile, (err, data) => {
        if (err) {
          console.log('Error file deleting');
        }
      });

      return ApiSuccess(res, 200, true, "Student delete successfully");
    } else {
      return ApiError(res, 400, "Student not found");
    }
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

module.exports = {
  createStudentController,
  getAllStudentsController,
  getStudentByIdController,
  updateStudentByIdController,
  deleteStudentByIdController,
};
