const { google } = require("googleapis");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

(async () => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    console.log("✅ Access token fetched successfully!");
    console.log("Access Token:", accessToken.token);
  } catch (err) {
    console.error("❌ Failed to fetch access token:", err.message);
  }
})();
