const db = require("../config/db");

const getAllBanner = async () => {
  try {
    const query = {
      name: "fetch-users",
      text: "SELECT * FROM information.banner",
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    return error;
  }
};

const getAllService = async () => {
  try {
    const query = {
      name: "fetch-users",
      text: "SELECT * FROM information.service",
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    return error;
  }
};

const getOneService = async (code) => {
  try {
    const query = {
      name: "fetch-users",
      text: "SELECT * FROM information.service WHERE LOWER(service_code) = LOWER($1)",
      values: [code],
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    return error;
  }
};

module.exports = { getAllBanner, getAllService, getOneService };
