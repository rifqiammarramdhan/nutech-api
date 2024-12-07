const { Router } = require("express");
const { getAllBanner, getAllService } = require("../../models/information");

const router = Router();

router.get("/banner", async (req, res) => {
  try {
    const result = await getAllBanner();

    res.status(200).json({
      status: 0,
      message: "Sukses",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 108,
      message: error.message,
      data: null,
    });
  }
});

router.get("/service", async (req, res) => {
  try {
    const result = await getAllService();

    res.status(200).json({
      status: 0,
      message: "Sukses",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 108,
      message: error.message,
      data: null,
    });
  }
});

module.exports = router;
