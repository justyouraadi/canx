const { StatusCodes } = require("http-status-codes");
const { ClaimService } = require("../service");
const { ErrorResponse, SuccessResponse } = require("../utils/common");

const claimService = new ClaimService();

async function create(req, res) {
  try {
    const response = await claimService.create({
      employee: req.employee._id,
      title: req.body.title,
      amount: req.body.amount,
      description: req.body.description,
      bill: req.file ? req.file.filename : null,
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

async function replyOnClaim(req, res) {
  try {
    const response = await claimService.replyOnClaim({
      employee: req.body.employee,
      claimId: req.body.claimId,
      status: req.body.status,
      response: req.body.response,
    });
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = {};
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getAllEmployeeClaims(req, res) {
  try {
    const response = await claimService.getAllEmployeeClaims({
      employeeId: req.employee._id,
      status: req.query.status,
      date: req.query.date,
      page: req.query.page,
      limit: req.query.limit,
    });
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function getForAdmin(req, res) {
  try {
    const response = await claimService.getForAdmin({
      // employeeId: req.params.id,
      status: req.query.status,
      date: req.query.date,
      page: req.query.page,
      limit: req.query.limit,
    });
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  create,
  replyOnClaim,
  getForAdmin,
  getAllEmployeeClaims
};
