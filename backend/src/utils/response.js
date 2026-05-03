const success = (res, data, statusCode = 200, meta = {}) => {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {
      requestId: req.requestId, // Wait, req is not available here unless passed
      timestamp: new Date().toISOString(),
      ...meta
    }
  });
};

// Fixed version that takes req or requestId
const successFixed = (req, res, data, statusCode = 200, meta = {}) => {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
      ...meta
    }
  });
};

const paginated = (res, data, pagination) => {
  return res.status(200).json({
    success: true,
    data,
    pagination,
    meta: {
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = {
  success: successFixed,
  paginated
};
