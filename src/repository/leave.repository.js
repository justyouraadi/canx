const Leave = require("../models/leave.model");
const CrudRepository = require("./crud.repository");

class LeaveRepository extends CrudRepository {
  constructor() {
    super(Leave);
  }
}

module.exports = LeaveRepository;
