const Claim = require("../models/claim.model");
const CrudRepository = require("./crud.repository");

class ClaimRepository extends CrudRepository {
  constructor() {
    super(Claim);
  }
}

module.exports = ClaimRepository;