const Employee = require("../models/employee.model");
const CrudRepository = require("./crud.repository");

class EmployeeRepository extends CrudRepository {
  constructor() {
    super(Employee);
  }
}

module.exports = EmployeeRepository;