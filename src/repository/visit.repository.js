const Visit = require("../models/visit.model");
const CrudRepository = require("./crud.repository");

class VisitRepository extends CrudRepository {
  constructor() {
    super(Visit);
  }
}

module.exports = VisitRepository;