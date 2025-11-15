const Department = require("../models/derpartment.model");
const CrudRepository = require("./crud.repository");

class DepartmentRepository extends CrudRepository {
  constructor() {
    super(Department);
  }
}

module.exports = DepartmentRepository;