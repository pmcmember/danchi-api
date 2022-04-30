module.exports = async() => ({
  verbose: true,
  globalSetup: "<rootDir>/bin/setup.js",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      "tsconfig": "tsconfig.json"
    }
  },
  testMatch: [
    "**/__test__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  moduleNameMapper: {
    "^@\/(.+)": "<rootDir>/src/$1",
    "^\/(.+)": "<rootDir>/$1"
  },
})