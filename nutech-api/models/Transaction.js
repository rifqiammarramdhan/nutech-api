const db = require("../config/db");

exports.getUserBalance = async (email) => {
  try {
    const query = {
      name: "fetch-users-balance",
      text: `SELECT * 
          FROM nutech.transactions.user_accounts AS ua
          JOIN nutech.users.users AS u
              ON ua.user_id = u.user_id
          WHERE u.email = $1;
        `,
      values: [email],
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    return error;
  }
};

exports.updateBalance = async (email, balance) => {
  try {
    const query = {
      name: "add-user_balance",
      text: `UPDATE nutech.transactions.user_accounts AS ua
        SET balance = balance + $2  
        WHERE user_id = (
            SELECT user_id
            FROM nutech.users.users
            WHERE email = $1
        ) RETURNING *;`,
      values: [email, balance],
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    return error;
  }
};

exports.getOneTransactionByEmail = async (email) => {
  try {
    const query = {
      name: "fetch-one-transaction",
      text: ` SELECT * 
                FROM nutech.transactions."transaction" t  
                WHERE t.user_id = (
                    SELECT u.user_id
                    FROM nutech.users.users u
                    WHERE u.email = $1
                    LIMIT 1
                )
                ORDER BY t.invoice_number DESC;`,
      values: [email],
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    return error.message;
  }
};

exports.findTransactionByInvNum = async (invoice) => {
  try {
    const query = {
      name: "Find-Transaction-By-Inv-Num",
      text: ` SELECT * 
                FROM nutech.transactions."transaction" t  
                WHERE t.invoice_number = $1
                LIMIT 1`,
      values: [invoice],
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    return error.message;
  }
};

exports.setTransaction = async (invoice, amount, email, transaction_type, description, service_code, service_name) => {
  try {
    const query = {
      name: "setTransaction",
      text: `INSERT INTO transactions.transaction (user_id, invoice_number, transaction_type, description,total_amount,service_code,service_name)
        SELECT users.user_id, $1, $4, $5, $2, $6, $7
        FROM users.users
        WHERE users.email = $3`,
      values: [invoice, amount, email, transaction_type, description, service_code, service_name],
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    return error;
  }
};

exports.getHistory = async (email, limit, offset) => {
  try {
    const query = {
      name: "Get-History",
      text: `SELECT * FROM transactions.transaction 
      WHERE transactions.transaction.user_id = (
                    SELECT u.user_id
                    FROM nutech.users.users u
                    WHERE u.email = $1
                    LIMIT 1
                )
        ORDER by transactions.transaction.created_on desc
        OFFSET $3 
        LIMIT $2;`,
      values: [email, limit, offset],
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    return error;
  }
};
