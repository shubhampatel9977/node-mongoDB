const studentModel = require('../models/studentModel');

const createStudentService = async (payload) => {
  try {
    const add = new studentModel(payload);
    const savedStudent = await add.save();
    return savedStudent;
  } catch (error) {
    console.error("Something wrong in createStudentService", error?.message);
  }
}

const getAllStudentsService = async (page, limit, name) => {
  try {

    // Calculate the offset
    const offset = (page - 1) * limit;

    // Create a filter object for the search query
    const filter = name ? { name: new RegExp(name, 'i') } : {};

    // Fetch the total number of students
    const totalStudents = await studentModel.countDocuments(filter);

    const students = await studentModel.find(filter).skip(offset).limit(limit);

    return {
      total: totalStudents,
      students
    };

  } catch (error) {
    console.error("Something wrong in getAllStudentsService", error?.message);
  }
}

const getStudentByIdService = async (id) => {
  try {
    const studentsData = await studentModel.findById(id);
    return studentsData;
  } catch (error) {
    console.error("Something wrong in getStudentByIdService", error?.message);
  }
}

const updateStudentByIdService = async (id, payload) => {
  try {
    const options = { new: true }; // create new if id not found
    const updateStudent = await studentModel.findByIdAndUpdate(id, payload, options)
    return updateStudent;
  } catch (error) {
    console.error("Something wrong in updateStudentByIdService", error?.message);
  }
}

const deleteStudentByIdService = async (id) => {
  try {
    const deleteStudent = await studentModel.findByIdAndDelete(id);
    return deleteStudent;
  } catch (error) {
    console.error("Something wrong in deleteStudentByIdService", error?.message);
  }
}

module.exports = {
  createStudentService,
  getAllStudentsService,
  getStudentByIdService,
  updateStudentByIdService,
  deleteStudentByIdService,
};