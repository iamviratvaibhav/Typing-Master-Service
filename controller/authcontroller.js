import OAuthAccount from '../models/OAuthAccount.js';
const oauthAccount = await OAuthAccount.findOne({ provider, providerAccountId });

if (!oauthAccount) {
  // User not found – clear cookies/session
  res.clearCookie("access_token");
  res.status(401).json({ message: "User not found" });
  return;
}
