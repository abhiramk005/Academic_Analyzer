const errorHandler = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
  };
  
  const handleError = (err, req, res, next) => {
    console.error("Error handler caught an error:", err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  };
  
  module.exports = {
    errorHandler,
    handleError
  };