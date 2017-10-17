module.exports = {
    bail: true,
    snapshotSerializers: ['enzyme-to-json/serializer'],
    transform: {
        '.(ts|tsx)': '<rootDir>/node_modules/ts-jest/preprocessor.js'
    },
    testPathIgnorePatterns: ['/node_modules/', '/lib/'],
    testRegex: 'test.(ts|tsx|js)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json']
};
