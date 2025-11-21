const Setting = require("../models/setting.model");
const CrudRepository = require("./crud.repository");

class SettingRepository extends CrudRepository {
  constructor() {
    super(Setting);
  }
}

module.exports = SettingRepository;
