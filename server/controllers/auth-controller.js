const User = require("../models/user-models");

const createHttpError = (status, message, details = []) => {
  const error = new Error(message);
  error.status = status;
  error.details = details;
  return error;
};

const getActiveDbSource = () => {
  const target = (process.env.DB_TARGET || "local").toLowerCase();
  return target === "cloud" ? "cloud" : "local";
};

const home = async (req, res, next) => {
  try {
    return res.status(200).json({ msg: "Welcome to our home page" });
  } catch (error) {
    return next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, email, phone, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const adminCount = await User.countDocuments({ isAdmin: true });
    const shouldBootstrapAdmin = adminCount === 0;

    const userExist = await User.findOne({ email: normalizedEmail });
    if (userExist) {
      return next(
        createHttpError(409, "Email already exists", [
          `The email ${normalizedEmail} already exists in the active ${getActiveDbSource()} database.`,
        ])
      );
    }

    const userCreated = await User.create({
      username,
      email: normalizedEmail,
      phone,
      password,
      isAdmin: shouldBootstrapAdmin,
    });

    return res.status(201).json({
      message: "Registration Successful",
      userId: userCreated._id.toString(),
      token: await userCreated.generateToken(),
    });
  } catch (error) {
    if (error.code === 11000) {
      const normalizedEmail = req.body?.email?.trim().toLowerCase();
      return next(
        createHttpError(409, "Email already exists", [
          normalizedEmail
            ? `The email ${normalizedEmail} already exists in the active ${getActiveDbSource()} database.`
            : `A user with this email already exists in the active ${getActiveDbSource()} database.`,
        ])
      );
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const userExist = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!userExist) {
      return next(createHttpError(404, "Email is not registered"));
    }

    const isPasswordValid = await userExist.comparePassword(password);
    if (!isPasswordValid) {
      return next(createHttpError(401, "Incorrect password"));
    }

    const adminCount = await User.countDocuments({ isAdmin: true });
    if (adminCount === 0 && !userExist.isAdmin) {
      userExist.isAdmin = true;
      await userExist.save();
    }

    return res.status(200).json({
      message: "Login Successful",
      token: await userExist.generateToken(),
      userId: userExist._id.toString(),
    });
  } catch (error) {
    return next(error);
  }
};

const user = async (req, res, next) => {
  try {
    const userData = req.user;
    return res
      .status(200)
      .json({ msg: "User data retrieved successfully", userData });
  } catch (error) {
    return next(error);
  }
};

module.exports = { home, register, login, user };
