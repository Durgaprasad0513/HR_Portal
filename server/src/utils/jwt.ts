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

export const generatePublicEmployeeCardToken = (employeeId: string): string => {
  return jwt.sign({ purpose: 'public_employee_card' }, config.jwt.secret, { subject: employeeId });
};

export const verifyPublicEmployeeCardToken = (token: string): string => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (typeof payload === 'string' || payload.purpose !== 'public_employee_card' || !payload.sub) {
    throw new Error('Invalid public employee card token.');
  }
  return payload.sub;
};
