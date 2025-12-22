
const Slip = require("../models/slip.model");
const CrudRepository = require("./crud.repository");

class SlipRepository extends CrudRepository {
  constructor() {
    super(Slip);
  }
}

module.exports = SlipRepository;
