const teacherValidation = require("../../validations/admin/teacherValidation");
const teacherModel = require("../../models/admin/teacher.model");
const { deleteFile } = require("../../utils/fileUploadOnLocal");
const { ApiSuccess, ApiError } = require("../../utils/ApiResponse");

const createTeacherController = async (req, res) => {
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
    const { error, value } = teacherValidation.teacherSchema.validate(req.body);
    if (error)
      return ApiError(res, 400, error.details[0].message);

    // add file path
    value.profile = file?.path

    // Create Teacher
    const addTeacher = new teacherModel(value);
    await addTeacher.save();

    return ApiSuccess(res, 201, true, "Teacher add successfully", result);

  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const getAllTeachersController = async (req, res) => {
  try {
    // const userId = req.userId   // Login user id get in token

    // Check Validation
    const { error, value } = teacherValidation.teacherPagination.validate(req.query);
    if (error)
      return ApiError(res, 400, error.details[0].message);

    const { page = 1, limit = 10, name = '' } = value;
    const offset = (page - 1) * limit;

    // Create a filter object for the search query
    const filter = name ? { name: new RegExp(name, 'i') } : {};

    // Get all teachers
    const totalTeachers = await teacherModel.countDocuments(filter);
    const teachers = await teacherModel.find(filter).skip(offset).limit(limit);

      const data = {
        currentPage: page,
        totalPage: Math.ceil(totalTeachers / limit), // Calculate total number of pages
        totalCount: totalTeachers,
        teachersData: teachers,
      }
      return ApiSuccess(res, 200, true, "Get All Teachers Data", data);

  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const getTeacherByIdController = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = teacherValidation.teacherIdSchema.validate(req.params);
    if (error)
      return ApiError(res, 400, error.details[0].message);

    // Get teacher by id
    const teacherData = await teacherModel.findById(value.id);

    if (teacherData) {
      return ApiSuccess(res, 200, true, "Get teacher data", teacherData);
    } else {
      return ApiError(res, 400, "Teacher not found");
    }
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const updateTeacherByIdController = async (req, res) => {
  try {
    // Check Validation Param
    const { error: idError, value: idValue } = teacherValidation.teacherIdSchema.validate(req.params);
    if (idError)
      return ApiError(res, 400, idError.details[0].message);

    // Check Validation Body
    const { error: bodyError, value: bodyValue } = teacherValidation.teacherSchema.validate(req.body);
    if (bodyError)
      return ApiError(res, 400, bodyError.details[0].message);

    // If getting single file then use this function
    const file = req.file;

    if (file) {

      // Get teacher by id
      const teacherData = await teacherModel.findById(idValue.id);

      // delete exist file path
      deleteFile(teacherData?.profile, (err, data) => {
        if (err) {
          console.log('Error file deleting');
        }
      })

      // update new file path
      bodyValue.profile = file?.path
    }

    // Find teacher and update
    const teacherUpdateData = await teacherModel.findByIdAndUpdate(idValue.id, bodyValue);
    
    if (teacherUpdateData) {
      return ApiSuccess(res, 200, true, "Teacher update successfully", teacherUpdateData);
    } else {
      return ApiError(res, 400, "Teacher not found");
    }
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const deleteTeacherByIdController = async (req, res) => {
  try {
    // Check Validation Param
    const { error, value } = teacherValidation.teacherIdSchema.validate(req.params);
    if (error)
      return ApiError(res, 400, error.details[0].message);
    
    // Find and delete teacher
    const teacherData = await teacherModel.findByIdAndDelete(value.id);

    if (teacherData) {

      // delete exist file path
      deleteFile(teacherData?.profile, (err, data) => {
        if (err) {
          console.log('Error file deleting');
        }
      });

      return ApiSuccess(res, 200, true, "Teacher delete successfully");
    } else {
      return ApiError(res, 400, "Teacher not found");
    }
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

module.exports = {
  createTeacherController,
  getAllTeachersController,
  getTeacherByIdController,
  updateTeacherByIdController,
  deleteTeacherByIdController,
};
