import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverage: true,
  coverageDirectory: "./coverage/",
  coveragePathIgnorePatterns: [
    "node_modules",
    "scripts",
    "dist",
    "locale"
  ],
  coverageReporters: [
    "html",
    "lcov"
  ],
  preset: "ts-jest",
  reporters: [
    "default",
    "jest-junit"
  ],
  transformIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  testEnvironment: "node"
}

export default config;
