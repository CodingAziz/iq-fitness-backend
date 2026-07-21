import { configDotenv } from 'dotenv';
configDotenv();

import jwt from 'jsonwebtoken';

export const createSecretToken = (userId, sessionId) => {
  const accessToken = jwt.sign({ userId }, process.env.TOKEN_KEY, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ userId, sessionId }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};
