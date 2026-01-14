import jwt from 'jsonwebtoken';

const createTokenAndSaveCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: '3d',
  });

  res.cookie('jwt', token, {
    // httpOnly: true,           // Prevent access from JavaScript (XSS protection)
    secure: process.env.NODE_ENV === 'production', //  Only send cookie over HTTPS in production
    sameSite: 'strict',       //  Prevent CSRF by not sending cookie cross-site
    maxAge: 24 * 60 * 60 * 1000, //  Cookie expiry: 1 day (in ms)
    path: '/',                //  Scope of the cookie
  });

  return token; // optional: if you also want to send token in response
};

export default createTokenAndSaveCookie;
