const { Router } = require("express");
const { registration, login, profile, updateProfile, profileImage } = require("../controllers/userController");
const verifyToken = require("../middlewares/auth/tokenValidation");
const upload = require("../middlewares/multer/multer");

const registerRoute = Router();

registerRoute.post("/registration", registration);
registerRoute.post("/login", login);
registerRoute.get("/profile", verifyToken, profile);
registerRoute.put("/profile/update", verifyToken, updateProfile);
registerRoute.put("/profile/image", verifyToken, upload.single("file"), profileImage);

module.exports = registerRoute;
