const { Router } = require("express");
const { getBalance, topupBalance, paymentTransaction, transactionHistory } = require("../controllers/transactionController");
const verifyToken = require("../middlewares/auth/tokenValidation");

const transactionRoute = Router();

transactionRoute.get("/balance", verifyToken, getBalance);
transactionRoute.post("/topup", verifyToken, topupBalance);
transactionRoute.post("/transaction", verifyToken, paymentTransaction);
transactionRoute.get("/transaction/history", verifyToken, transactionHistory);

module.exports = transactionRoute;
