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
                },
            },
        },
    },
};
