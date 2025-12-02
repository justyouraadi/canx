const Offline = require("../models/offline.model");
const CrudRepository = require("./crud.repository");

class OfflineRepository extends CrudRepository {
  constructor() {
    super(Offline);
  }
}

module.exports = OfflineRepository;
