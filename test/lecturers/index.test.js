const getLecturersList = require("./get-lecturers-list.test");
const getLecturerDetail = require("./get-lecturer-detail.test");
const deleteLecturer = require('./delete-lecturer.test');

module.exports = () => {
    getLecturersList();
    getLecturerDetail();
    deleteLecturer();
};
