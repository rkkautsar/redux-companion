module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['packages/**/lib/*.ts', '!**/node_modules/**'],
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};
