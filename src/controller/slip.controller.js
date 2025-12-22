const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const SlipService = require("../service/slip.service");


const slipService = new SlipService();

async function generateSlip(req, res) {
  try {
    const response = await slipService.generateSlip({
      employee: req.body.employeeId,
      month: req.body.month,
      year: req.body.year,
      bonus: req.body.bonus,
      deductions: req.body.deductions,
      netSalary: req.body.netSalary,
    });
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = {};
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  generateSlip,
};
