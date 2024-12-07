const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      status: 108,
      message: "Token tidak ada. Harap menyertakan token",
      data: null,
    });
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      status: 108,
      message: "Format token tidak valid. Gunakan format Bearer <token>",
      data: null,
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 108,
        message: "Token tidak valid atau kadaluwarsa",
        data: null,
      });
    }

    req.email = decoded.user_email;
    next();
  });
};

module.exports = verifyToken;
