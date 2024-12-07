const { Router } = require("express");
const userRoute = require("./userRoute");
const informationRoute = require("./InformationRoute");
const transactionRoute = require("./TransactionRoute");

const router = Router();

router.use("/", userRoute);
router.use("/", informationRoute);
router.use("/", transactionRoute);

module.exports = router;
