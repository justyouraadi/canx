const { StatusCodes } = require("http-status-codes");
const { SettingRepository } = require("../repository");
const AppError = require("../utils/errors/app.error");

const settingRepository = new SettingRepository();

class SettingService {
  async getSettings() {
    try {
      const response = await settingRepository.findOne({});
      return response;
    } catch (error) {
      throw new AppError(
        ["Internal Server Error"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateSettings(params) {
    try {
      const getSettings = await settingRepository.findOne({});
      if (!getSettings) {
        throw new AppError(["Settings not found"], StatusCodes.NOT_FOUND);
      }
      const response = await settingRepository.updateById(
        getSettings._id,
        params,
        { new: true }
      );
      if (!response) {
        throw new AppError(
          ["Settings not updated, try again later"],
          StatusCodes.BAD_REQUEST
        );
      }
      return response;
    } catch (error) {
      throw new AppError(
        ["Internal Server Error"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = SettingService;
