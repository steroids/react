export default {
    http: {
        setAccessToken: jest.fn(),
        removeAccessToken: jest.fn(),
        onLogout: jest.fn(),
        onLogin: jest.fn(),
        send: jest.fn(),
    },
};
