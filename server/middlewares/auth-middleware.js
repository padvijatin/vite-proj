const jwt = require("jsonwebtoken");
const User = require("../models/user-models");

const extractToken = (authHeader = "") => {
  if (!authHeader) {
    return { token: "", hasBearerScheme: false };
  }

  const trimmedHeader = authHeader.trim();
  const bearerMatch = trimmedHeader.match(/^Bearer\s+(.+)$/i);
  const token = bearerMatch ? bearerMatch[1] : "";

  return {
    token: token.replace(/^"|"$/g, "").trim(),
    hasBearerScheme: Boolean(bearerMatch),
  };
};

const isConfiguredAdmin = (user) => {
  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!configuredAdminEmail || !user?.email) {
    return false;
  }

  return user.email.toLowerCase() === configuredAdminEmail;
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const { token, hasBearerScheme } = extractToken(authHeader);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  if (!hasBearerScheme) {
    return res.status(401).json({
      message: "Unauthorized: Authorization header must use Bearer token",
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server error: JWT secret missing" });
    }

    const verifiedPayload = jwt.verify(token, process.env.JWT_SECRET);
    const userData = await User.findById(verifiedPayload.userId).select({
      password: 0,
    });

    if (!userData) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const resolvedAdminStatus = Boolean(
      userData.isAdmin || verifiedPayload.isAdmin || isConfiguredAdmin(userData)
    );
    userData.isAdmin = resolvedAdminStatus;

    req.user = userData;
    req.token = token;
    req.userId = userData._id;
    req.auth = {
      userId: userData._id.toString(),
      isAdmin: resolvedAdminStatus,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    return res.status(401).json({ message: "Unauthorized: Token verification failed" });
  }
};
module.exports = authMiddleware;
