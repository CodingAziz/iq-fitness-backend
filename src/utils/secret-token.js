import { configDotenv } from 'dotenv';
configDotenv();

import jwt from 'jsonwebtoken';

module.exports.createSecretToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};
