const swapService = require("../../services/swaps.service");

/**
 * POST /private/api/swaps
 */
async function createSwap(req, res, next) {
  try {
    const user_id = req.user.id;
    await swapService.createSwapRequest(user_id, req.body);
    res
      .status(201)
      .json({ success: true, message: "Swap request created successfully" });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /private/api/swaps/update_status
 */
async function updateStatus(req, res, next) {
  try {
    const { id } = req.query;
    const { status } = req.body;

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      const error = new Error("Invalid status value");
      error.statusCode = 400;
      throw error;
    }

    const swap = await swapService.updateSwapStatus(id, status);
    res.status(200).json({ success: true, data: swap });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /private/api/swaps
 */
async function getRequests(req, res, next) {
  try {
    const userId = req.user.id;
    const requests = await swapService.getUserRequests(userId);
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createSwap,
  updateStatus,
  getRequests,
};
