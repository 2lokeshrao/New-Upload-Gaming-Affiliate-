console.log("Checking for DB environment variables:");
console.log("DB_HOST:", process.env.DB_HOST || "Not Set");
console.log("DB_USER:", process.env.DB_USER || "Not Set");
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "Set (Hidden)" : "Not Set");
console.log("DB_NAME:", process.env.DB_NAME || "Not Set");
