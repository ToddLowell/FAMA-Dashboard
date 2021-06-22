import jwt from 'jsonwebtoken';
import { authenticate } from 'ldap-authentication';
import type { RequestHandler } from 'express';
import config from '../config/jwt';
import { verifyUsername } from './admin';

interface VerifiedToken {
  iat: number;
  username: string;
}

export const newToken = (username: string) => {
  return jwt.sign({ username }, config.secret.jwt, {
    expiresIn: config.secret.jwtExp,
  });
};

export const newRefreshToken = (username: string) => {
  return jwt.sign({ username }, config.secret.jwtRefresh, {
    expiresIn: config.secret.jwtExpRefresh,
  });
};

export const verifyToken = (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secret.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

export const verifyRefreshToken = (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secret.jwtRefresh, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

export const signin: RequestHandler = async (req, res) => {
  const { username, userPassword } = req.body;

  if (!username || !userPassword)
    return res.status(400).json({
      message: 'Username and/or Password Missing',
    });

  const verifiedUser = verifyUsername(username);

  if (!verifiedUser)
    return res.status(401).json({
      message: 'Sila berhubung dengan Admin Sistem untuk kebenaran masuk',
    });

  const accessToken = newToken(username);
  const refreshToken = newRefreshToken(username);

  // ! add to DB
  tokens.push(refreshToken);

  try {
    const options = {
      ldapOpts: {
        url: 'ldap://localhost',
      },
      adminDn: 'uid=agrisistem,ou=systems,dc=fama,dc=gov,dc=my',
      adminPassword: 'agrisistem',
      username,
      userPassword,
      userSearchBase: 'dc=fama,dc=gov,dc=my',
      usernameAttribute: 'famaPersonICNumber',
    };

    const user = await authenticate(options);

    return res.status(201).json({
      message: 'Login Successul',
      accessToken,
      refreshToken,
      username: user.cn,
      admin: verifiedUser[1],
    });
  } catch (e) {
    // ! for dev server
    if (process.env.NODE_ENV === 'development')
      return res.status(401).json({
        message: 'Katanama atau katakunci salah',
        accessToken,
        refreshToken,
        username: verifiedUser[0],
        admin: verifiedUser[1],
      });

    return res.status(401).json({
      message: 'Katanama atau katakunci salah',
    });
  }
};

// ! migrate to DB
const tokens: string[] = [];

export const refresh: RequestHandler = async (req, res) => {
  const refreshToken = (req.body as { refreshToken: string }).refreshToken;

  if (!refreshToken) return res.sendStatus(401);

  // ! check DB
  if (!tokens.includes(refreshToken)) return res.sendStatus(403);

  try {
    const { username } = (await verifyRefreshToken(
      refreshToken
    )) as VerifiedToken;

    const accessToken = newToken(username);
    return res.status(201).json({ accessToken });
  } catch (e) {
    return res.sendStatus(403);
  }
};

export const protect: RequestHandler = async (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ message: 'Auth Header Missing' });

  const token = req.headers.authorization.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token Missing' });

  try {
    await verifyToken(token);

    next();
  } catch (e) {
    if (e.name === 'TokenExpiredError')
      return res.status(401).json({ message: 'TOKEN_EXPIRED' });

    return res.status(401).json({ message: 'TOKEN_INVALID' });
  }
};
