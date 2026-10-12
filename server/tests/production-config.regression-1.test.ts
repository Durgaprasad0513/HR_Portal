// /qa 2026-10-12: production must fail closed on insecure authentication defaults.
describe('production configuration', () => {
  const original = { ...process.env };
  afterEach(() => { process.env = { ...original }; jest.resetModules(); });
  it('rejects an absent production signing key', () => {
    process.env.NODE_ENV='production'; process.env.JWT_SECRET='';
    expect(() => require('../src/config')).toThrow('JWT_SECRET');
  });
  it('rejects the known default production signing key', () => {
    process.env.NODE_ENV='production'; process.env.JWT_SECRET='default-secret-change-me';
    expect(() => require('../src/config')).toThrow('JWT_SECRET');
  });
  it('accepts an explicitly configured production key', () => {
    process.env.NODE_ENV='production'; process.env.JWT_SECRET='synthetic-production-config-test-key';
    expect(require('../src/config').config.jwt.secret).toBe(process.env.JWT_SECRET);
  });
});
