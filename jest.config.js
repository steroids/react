const isLocal = require('fs').existsSync(require('path').resolve(__dirname, 'react-bootstrap'));

module.exports = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    setupFilesAfterEnv: [
        '<rootDir>/tests/setup.tsx',
    ],
    moduleNameMapper: {
        'lodash-es/(.*)': 'lodash/$1',
        '@steroidsjs/bootstrap/(.*)': isLocal ? '<rootDir>/react-bootstrap/src/$1' : '<rootDir>/../react-bootstrap/src$1',
        '@steroidsjs/core/(.*)': '<rootDir>/src/$1',
    },
    globals: {
        'ts-jest': {
            tsconfig: {
                jsx: 'react',
                experimentalDecorators: true,
                esModuleInterop: true,
                paths: {
                    '@steroidsjs/core/*': [
                        './src/*',
                    ],
                    '@steroidsjs/bootstrap/*': [
                        isLocal ? 'react-bootstrap/src/*' : '<rootDir>/../react-bootstrap/src*',
                    ],
                },
            },
        },
    },
};
