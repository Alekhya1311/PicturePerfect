module.exports = {
  // The root directory that Jest should scan for tests and modules within
  roots: ["<rootDir>/src"],

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // The testing framework that will be used for testing
  preset: "jest-preset-react",

  // The glob patterns Jest should use to detect test files
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],

  // The list of paths to directories that Jest should use to look for modules
  moduleDirectories: ["node_modules", "src"],

  // The module file extensions that Jest should use to detect modules
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

  // The transform configuration that Jest should use to transform modules
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },

  // The list of paths to directories that Jest should use to search for test files
  roots: ["<rootDir>/src"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  collectCoverageFrom: ["src/**/*.{js,jsx,mjs}"],
  coveragePathIgnorePatterns: ["/node_modules/", "index.js"],
};
