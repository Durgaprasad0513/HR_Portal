import jwt from 'jsonwebtoken';
import { config } from '../config';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  employeeId: string | null;
  tokenVersion: number;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};
