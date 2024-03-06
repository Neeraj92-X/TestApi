const config = {
  database: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10
  },
  jwtConfig: {
    jwtKey: process.env.JWTKEY,
    jwtExpirySeconds: process.env.JWTEXPIRYSECONDS,
    refreshTokenExpiry: process.env.REFRESHTOKENEXPIRY,
    verificationTokenExpiry:process.env.VERIFICATIONTOKENEXPIRY
  }
};

module.exports = config;
