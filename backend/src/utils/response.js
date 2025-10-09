module.exports = {
  success: (res, data, message = "Success") => {
    return res.status(200).json({ success: true, message, data });
  },

  error: (res, message = "Something went wrong", code = 500) => {
    return res.status(code).json({ success: false, message });
  },
};
