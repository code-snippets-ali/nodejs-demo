module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    globalTeardown: "<rootDir>/test/globalTeardown.ts",
};
