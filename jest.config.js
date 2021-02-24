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
        '@steroidsjs/bootstrap/(.*)': isLocal ? '<rootDir>/react-bootstrap/$1' : '<rootDir>/../react-bootstrap/$1',
        '@steroidsjs/core/(.*)': '<rootDir>/$1',
    },
    globals: {
        'ts-jest': {
            tsconfig: {
                jsx: 'react',
                experimentalDecorators: true,
                esModuleInterop: true,
                paths: {
                    '@steroidsjs/core/*': [
                        './*',
                    ],
                    '@steroidsjs/bootstrap/*': [
                        isLocal ? 'react-bootstrap/*' : '<rootDir>/../react-bootstrap/*',
                    ],
                },
            },
        },
    },
};
