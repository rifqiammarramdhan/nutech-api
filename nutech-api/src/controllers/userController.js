const { addUser, getOneUserByEmail, updateOneUserByEmail, updateImg } = require("../../models/Users");
const { addUserAccount } = require("../../models/Transaction");
const { userSchema, loginSchema } = require("../middlewares/validation/validationUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registration = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;

  const userValidationResult = userSchema.safeParse(req.body);

  if (!userValidationResult.success) {
    const errors = userValidationResult.error.errors.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));
    return res.status(400).json({
      status: "failed",
      message: "Validation errors",
      errors,
    });
  }

  try {
    const existingUser = await getOneUserByEmail(email);
    if (existingUser.length > 0) {
      return res.status(400).json({
        status: 102,
        message: "User telah terdaftar",
        data: null,
      });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await addUser(email, hashPassword, first_name, last_name);

    res.status(200).json({
      status: 0,
      message: "Registrasi berhasil, silakan login",
      data: null,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: 102,
      message: "Paramter email tidak sesuai format",
      data: null,
    });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const userValidationResult = loginSchema.safeParse(req.body);

  if (!userValidationResult.success) {
    const errors = userValidationResult.error.errors.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));
    return res.status(400).json({
      status: "failed",
      message: "Validation errors",
      errors,
    });
  }

  try {
    const user = await getOneUserByEmail(email);

    if (user.length < 1) throw new Error("username atau password salah");

    const match = await bcrypt.compare(password, user[0].password);
    if (!match) {
      throw new Error("username atau password salah");
    }

    const user_email = user[0].email;
    const user_id = user[0].user_id;

    const token = jwt.sign({ user_id, user_email }, process.env.SECRET_KEY, {
      expiresIn: "12h",
    });

    res.status(200).json({
      status: 0,
      message: "Login sukses",
      data: { token },
    });
  } catch (error) {
    res.status(400).json({
      status: 103,
      message: error.message,
      data: null,
    });
  }
};

// Profile
exports.profile = async (req, res) => {
  try {
    const emailDecode = req.email;
    const result = await getOneUserByEmail(emailDecode);
    const { user_id, email, first_name, last_name, profile_image } = result[0];

    res.status(200).json({
      status: 0,
      message: "Sukses",
      data: { user_id, email, first_name, last_name, profile_image },
    });
  } catch (error) {
    res.status(400).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  const user_first_name = req.body.first_name;
  const user_last_name = req.body.last_name;
  try {
    const emailDecode = req.email;

    const result = await updateOneUserByEmail(emailDecode, user_first_name, user_last_name);
    console.log(result);
    const data = { email: result.email, first_name: result.first_name, last_name: result.last_name, profile_image: result.profile_image };

    res.status(200).json({
      status: 0,
      message: "Update Pofile berhasil",
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
};

// Update Photo Profile
exports.profileImage = async (req, res) => {
  try {
    if (req.errorValidateFile) {
      throw new Error(req.errorValidateFile);
    }

    if (!req.file) throw new Error("File tidak ditemukan");

    const emailDecode = req.email;

    // image name
    const file = req.file;
    const fileName = file.filename;

    const pImg = `${req.protocol}://${req.hostname}:${process.env.PORT}/${fileName}`;

    const result = await updateImg(pImg, emailDecode);

    const { email, first_name, last_name, profile_image } = result[0];

    res.status(200).json({
      status: 0,
      message: "Update Profile Image berhasil",
      data: { email, first_name, last_name, profile_image },
    });
  } catch (error) {
    res.status(400).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
};
