const teacherModel = require('../../models/admin/teacherModel');

const createTeacherService = async (payload) => {
  try {
    const add = new teacherModel(payload);
    const savedTeacher = await add.save();
    return savedTeacher;
  } catch (error) {
    console.error("Something wrong in createTeacherService", error?.message);
  }
}

const getAllTeacherService = async (page, limit, name) => {
  try {

    // Calculate the offset
    const offset = (page - 1) * limit;

    // Create a filter object for the search query
    const filter = name ? { name: new RegExp(name, 'i') } : {};

    // Fetch the total number of teachers
    const totalTeachers = await teacherModel.countDocuments(filter);

    const teachers = await teacherModel.find(filter).skip(offset).limit(limit);

    return {
      total: totalTeachers,
      teachers
    };

  } catch (error) {
    console.error("Something wrong in getAllTeacherService", error?.message);
  }
}

const getTeacherByIdService = async (id) => {
  try {
    const teacherData = await teacherModel.findById(id);
    return teacherData;
  } catch (error) {
    console.error("Something wrong in getTeacherByIdService", error?.message);
  }
}

const updateTeacherByIdService = async (id, payload) => {
  try {
    const options = { new: true }; // create new if id not found
    const updateTeacher = await teacherModel.findByIdAndUpdate(id, payload, options)
    return updateTeacher;
  } catch (error) {
    console.error("Something wrong in updateTeacherByIdService", error?.message);
  }
}

const deleteTeacherByIdService = async (id) => {
  try {
    const deleteTeacher = await teacherModel.findByIdAndDelete(id);
    return deleteTeacher;
  } catch (error) {
    console.error("Something wrong in deleteTeacherByIdService", error?.message);
  }
}

module.exports = {
  createTeacherService,
  getAllTeacherService,
  getTeacherByIdService,
  updateTeacherByIdService,
  deleteTeacherByIdService,
};