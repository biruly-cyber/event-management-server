import ErrorHandler from "../utils/Errorhandler.js";

export default function errorMiddleware(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handle specific errors
  switch (err.name) {
    case "CastError":
      err = new ErrorHandler(`Resource not found. Invalid ${err.path}`, 400);
      break;
    case "ValidationError":
      const messages = Object.values(err.errors).map((value) => value.message);
      err = new ErrorHandler(messages.join(", "), 400);
      break;
    case "JsonWebTokenError":
      err = new ErrorHandler("JSON Web Token is invalid. Try again!", 401);
      break;
    case "TokenExpiredError":
      err = new ErrorHandler("JSON Web Token has expired. Try again!", 401);
      break;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
}
