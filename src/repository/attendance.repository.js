
const Attendance = require("../models/attendance.model");
const CrudRepository = require("./crud.repository");


class AttendanceRepository extends CrudRepository {
  constructor() {
    super(Attendance);
  }
}

module.exports = AttendanceRepository;