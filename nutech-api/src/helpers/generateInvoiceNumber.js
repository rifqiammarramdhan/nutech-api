const { getOneTransactionByEmail } = require("../../models/Transaction");
exports.generateInvoiceNumber = async (email) => {
  var lastInvNum = await getOneTransactionByEmail(email);

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  let uniqueNumber = "";

  if (lastInvNum.length < 1) {
    uniqueNumber = String(Math.floor("001")).padStart(3, "0");
  } else {
    uniqueNumber = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  }

  return `INV-${year}${month}${day}-${uniqueNumber}`;
};
