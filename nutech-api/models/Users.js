const db = require("../config/db");

exports.addUser = async (...data) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const queryUser = {
      name: "create-user",
      text: "INSERT INTO users.users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *",
      values: [...data],
    };

    const { rows: userRows } = await client.query(queryUser);

    const userId = userRows[0].id;

    const queryAccount = {
      text: "INSERT INTO transactions.user_accounts (user_id) VALUES ($1)",
      values: [userId],
    };

    await client.query(queryAccount);

    await client.query("COMMIT");

    return userRows;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

exports.getOneUserByEmail = async (email) => {
  try {
    const query = {
      name: "fetch-one-user",
      text: "SELECT * FROM users.users WHERE email = $1",
      values: [email],
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    return error.message;
  }
};

exports.updateOneUserByEmail = async (email, firstName = "", lastName = "") => {
  try {
    const query = {
      name: "update-one-user",
      text: `
        UPDATE users.users 
        SET first_name = $1, last_name = $2
        WHERE email = $3
        RETURNING *;
      `,
      values: [firstName, lastName, email],
    };

    const { rows } = await db.query(query);

    return rows[0];
  } catch (error) {
    return error.message;
  }
};

exports.updateImg = async (userImg_profile, email) => {
  try {
    const query = {
      text: "UPDATE users.users SET profile_image = $1 WHERE email = $2 RETURNING *",
      values: [userImg_profile, email],
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    return error;
  }
};
