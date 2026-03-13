const mongoose = require("mongoose");

const resolveMongoUri = () => {
  const target = (process.env.DB_TARGET || "local").toLowerCase();

  if (process.env.DB_URI) {
    return { uri: process.env.DB_URI, source: "DB_URI" };
  }

  if (target === "cloud") {
    return { uri: process.env.MONGO_URI, source: "MONGO_URI" };
  }

  return {
    uri: process.env.LOCAL_DB_URI || process.env.MONGO_URI,
    source: process.env.LOCAL_DB_URI ? "LOCAL_DB_URI" : "MONGO_URI",
  };
};

const shouldAllowLocalFallback = () =>
  (process.env.ALLOW_LOCAL_FALLBACK || "false").toLowerCase() === "true";

const connectWithUri = async (uri) => {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
};

const connectDb = async () => {
  const { uri, source } = resolveMongoUri();

  if (!uri) {
    console.error("database connection failed: No MongoDB URI found");
    process.exit(1);
  }

  try {
    await connectWithUri(uri);

    console.log(`connection successful to DB (${source}) -> ${mongoose.connection.name}`);
  } catch (error) {
    const localUri = process.env.LOCAL_DB_URI;
    const shouldTryLocalFallback =
      shouldAllowLocalFallback() &&
      source !== "LOCAL_DB_URI" &&
      Boolean(localUri) &&
      localUri !== uri;

    console.error(`database connection failed (${source}):`, error.message);

    if (!shouldTryLocalFallback) {
      process.exit(1);
    }

    try {
      await mongoose.disconnect();
    } catch {
      // ignore disconnect failures before retrying locally
    }

    try {
      await connectWithUri(localUri);
      console.log(
        `connection successful to DB (LOCAL_DB_URI fallback) -> ${mongoose.connection.name}`
      );
    } catch (localError) {
      console.error("local database fallback failed:", localError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDb;
