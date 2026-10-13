import { generatePublicEmployeeCardToken, generateToken, verifyPublicEmployeeCardToken } from '../src/utils/jwt';

describe('public employee card tokens', () => {
  it('verifies the employee identity encoded in a signed pass token', () => {
    const token = generatePublicEmployeeCardToken('employee-123');

    expect(verifyPublicEmployeeCardToken(token)).toBe('employee-123');
  });

  it('rejects regular login tokens and tampered pass tokens', () => {
    const loginToken = generateToken({ userId: 'user-1', email: 'person@example.test', role: 'ADMIN', employeeId: null, tokenVersion: 0 });
    const passToken = generatePublicEmployeeCardToken('employee-123');
    const [header, payload, signature] = passToken.split('.');
    const tamperedToken = `${header}.${payload}.${signature[0] === 'a' ? 'b' : 'a'}${signature.slice(1)}`;

    expect(() => verifyPublicEmployeeCardToken(loginToken)).toThrow('Invalid public employee card token.');
    expect(() => verifyPublicEmployeeCardToken(tamperedToken)).toThrow();
  });
});
