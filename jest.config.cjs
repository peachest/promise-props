// jest.config.js
module.exports = {
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!lodash-es)"
    ]
};
