const path = require('path');
const isLocal = require('fs').existsSync(path.resolve(__dirname, 'react-bootstrap'));

const corePath = path.join(__dirname, '/src/');
const bootstrapPath = path.join(__dirname, isLocal ? '/react-bootstrap/src/' : '/../react-bootstrap/src/');

module.exports = {
    verbose: true,
    testEnvironment: 'jest-environment-jsdom-fifteen',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    setupFilesAfterEnv: [
        '<rootDir>/tests/setup.tsx',
    ],
    moduleNameMapper: {
        'lodash-es/(.*)': 'lodash/$1',
        '@steroidsjs/core/(.*)': corePath + '$1',
        '@steroidsjs/bootstrap/(.*)': bootstrapPath + '$1',
        '^.+\\.svg$': path.join(__dirname, '/tests/svgTransform.js'),
    },
    globals: {
        'ts-jest': {
            tsconfig: {
                jsx: 'react',
                experimentalDecorators: true,
                esModuleInterop: true,
                paths: {
                    '@steroidsjs/core/*': [corePath + '*'],
                    '@steroidsjs/bootstrap/*': [bootstrapPath + '*'],
                },
            },
        },
    },
};
