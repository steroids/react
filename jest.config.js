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
        '@steroidsjs/bootstrap/(.*)': isLocal
            ? __dirname + '/react-bootstrap/src/$1'
            : __dirname + '/../react-bootstrap/src/$1',
    },
    globals: {
        'ts-jest': {
            tsconfig: {
                jsx: 'react',
                experimentalDecorators: true,
                esModuleInterop: true,
                paths: {
                    '@steroidsjs/bootstrap/*': [
                        isLocal
                            ? __dirname + '/react-bootstrap/src/*'
                            : __dirname + '/../react-bootstrap/src/*',
                    ],
                },
            },
        },
    },
};
