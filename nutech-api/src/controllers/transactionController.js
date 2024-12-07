const { getUserBalance, updateBalance, setTransaction, findTransactionByInvNum, getHistory } = require("../../models/Transaction");
const { getOneService } = require("../../models/information");
const { generateInvoiceNumber } = require("../helpers/generateInvoiceNumber");

exports.getBalance = async (req, res) => {
  try {
    const emailDecode = req.email;

    const result = await getUserBalance(emailDecode);
    console.log({ result });
    if (result.length < 1) throw new Error("Get Balance Gagal");

    res.status(200).json({
      status: 0,
      message: "Get Balance Berhasil",
      data: result[0].balance,
    });
  } catch (error) {
    res.status(400).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
};

// Top Up
exports.topupBalance = async (req, res) => {
  const emailDecode = req.email;
  const top_up_amount = +req.body.top_up_amount;
  try {
    if (top_up_amount === undefined) throw new Error("Amount tidak boleh kosong");

    const invoice = await generateInvoiceNumber(emailDecode);

    const result = await updateBalance(emailDecode, top_up_amount);
    await setTransaction(invoice, top_up_amount, emailDecode, "TOP UP", "Top Up Balance");

    res.status(200).json({
      status: 0,
      message: "Top Up Balance Berhasil",
      data: { Balance: result[0].balance },
    });
  } catch (error) {
    res.status(400).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
};

// Transaction
exports.paymentTransaction = async (req, res) => {
  const emailDecode = req.email;
  const { service_code } = req.body;
  try {
    const userBalance = await getUserBalance(emailDecode);

    if (userBalance[0].balance <= 0) throw new Error("Maaf saldo/balance anda tidak mencukupi");

    const service = await getOneService(service_code);

    if (service.length <= 0) throw new Error("Service ataus Layanan tidak ditemukan");

    const invoice = await generateInvoiceNumber(emailDecode);

    const transactionBalance = userBalance[0].balance - service[0].service_tariff;

    if (userBalance[0].balance < service[0].service_tariff) {
      throw new Error("Maaf Saldo balance anda tidak mencukupi untuk transaksi ini");
    }

    await updateBalance(emailDecode, transactionBalance);
    await setTransaction(invoice, service[0].service_tariff, emailDecode, "PAYMENT", "Payment", service_code, service[0].service_name);
    const data = await findTransactionByInvNum(invoice);
    res.status(200).json({
      status: 0,
      message: "Transaksi Berhasil",
      data: { data: data[0].invoice, Service_code: data[0].service_code, Service_name: data[0].service_name, transaction_type: data[0].transaction_type, total_amount: data[0].total_amount, created_on: data[0].created_on },
    });
  } catch (error) {
    res.status(400).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
};

// transaction history
exports.transactionHistory = async (req, res) => {
  try {
    const emailDecode = req.email;
    const { limit, offset } = req.query;

    const result = await getHistory(emailDecode, limit, offset);

    res.status(200).json({
      status: 0,
      message: "Get History Berhasil",
      offset,
      limit,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
};
