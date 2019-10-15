const config = {
  globals: {
    "ts-jest": {
      tsConfig: "./tsconfig.test.json"
    }
  },
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  testMatch: [
    '**/*.test.ts'
  ],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
}

module.exports = config;