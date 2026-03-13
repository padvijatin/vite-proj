const mongoose = require("mongoose");

const normalizeMongoUri = (value = "") =>
  String(value)
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^(DB_URI|MONGO_URI|LOCAL_DB_URI)\s*=\s*/i, "");

const resolveMongoUri = () => {
  const target = (process.env.DB_TARGET || "local").toLowerCase();
  const dbUri = normalizeMongoUri(process.env.DB_URI);
  const mongoUri = normalizeMongoUri(process.env.MONGO_URI);
  const localDbUri = normalizeMongoUri(process.env.LOCAL_DB_URI);

  if (dbUri) {
    return { uri: dbUri, source: "DB_URI" };
  }

  if (target === "cloud") {
    return { uri: mongoUri, source: "MONGO_URI" };
  }

  return {
    uri: localDbUri || mongoUri,
    source: localDbUri ? "LOCAL_DB_URI" : "MONGO_URI",
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
    const localUri = normalizeMongoUri(process.env.LOCAL_DB_URI);
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
