import ClientStorageComponent from '../../src/components/ClientStorageComponent';

let mockStorage = {};

//TODO Cookie Storage
describe('ClientStorageComponent', () => {
    const env = process.env;
    let storageSetItem;
    let storageGetItem;
    let storageRemoveItem;

    const getInstanceClientStorage = () => new ClientStorageComponent(null, {});

    beforeAll(() => {
        global.Storage.prototype.setItem = jest.fn((key, value) => {
            mockStorage[key] = value;
        });

        global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
        global.Storage.prototype.removeItem = jest.fn((key) => delete mockStorage[key]);
        global.Storage.prototype.mockReset = (func) => func.mockReset();

        storageSetItem = global.Storage.prototype.setItem;
        storageGetItem = global.Storage.prototype.getItem;
        storageRemoveItem = global.Storage.prototype.removeItem;
    });

    beforeEach(() => {
        mockStorage = {};
        //Isolate the work of the describe block with environment variables from other tests
        jest.resetModules();
        process.env = {...env};
    });

    describe('class fields', () => {
        it('constants name', () => {
            const clientStorage = getInstanceClientStorage();
            const expectedStorageCookie = 'cookie';
            const expectedStorageLocal = 'local';
            const expectedStorageSession = 'session';
            expect(clientStorage.STORAGE_COOKIE).toBe(expectedStorageCookie);
            expect(clientStorage.STORAGE_LOCAL).toBe(expectedStorageLocal);
            expect(clientStorage.STORAGE_SESSION).toBe(expectedStorageSession);
        });
    });

    describe('storages', () => {
        it('localStorage checks', () => {
            const localStorageAvailableArgument = 'localStorageAvailable';
            const localStorageValueArgument = '1';
            const clientStorage = getInstanceClientStorage();
            expect(localStorage.setItem).toHaveBeenCalledWith(localStorageAvailableArgument, localStorageValueArgument);
            expect(localStorage.getItem).toHaveBeenCalledWith(localStorageAvailableArgument);
            expect(localStorage.removeItem).toHaveBeenCalledWith(localStorageAvailableArgument);
            expect(clientStorage.localStorageAvailable).toBe(true);
        });

        it('sessionStorage checks', () => {
            const sessionStorageAvailableArgument = 'sessionStorageAvailable';
            const sessionStorageValueArgument = '1';
            const clientStorage = getInstanceClientStorage();

            expect(sessionStorage.setItem)
                .toHaveBeenCalledWith(sessionStorageAvailableArgument, sessionStorageValueArgument);

            expect(sessionStorage.getItem).toHaveBeenCalledWith(sessionStorageAvailableArgument);
            expect(sessionStorage.removeItem).toHaveBeenCalledWith(sessionStorageAvailableArgument);
            expect(clientStorage.sessionStorageAvailable).toBe(true);
        });
    });

    describe('methods', () => {
        const clientStorage = getInstanceClientStorage();

        describe('localStorage', () => {
            const localStorageKey = 'isMonday';
            const localStorageValue = true;

            it('set', () => {
                clientStorage.set(localStorageKey, localStorageValue, clientStorage.STORAGE_LOCAL);
                expect(localStorage.setItem).toHaveBeenCalledWith(localStorageKey, localStorageValue);
            });

            it('get', () => {
                clientStorage.get(localStorageKey, clientStorage.STORAGE_LOCAL);
                expect(localStorage.getItem).toHaveBeenCalledWith(localStorageKey);
            });

            it('remove', () => {
                clientStorage.remove(localStorageKey, clientStorage.STORAGE_LOCAL);
                expect(localStorage.removeItem).toHaveBeenCalledWith(localStorageKey);
            });
        });

        describe('sessionStorage', () => {
            const sessionStorageKey = 'isMonday';
            const sessionStorageValue = true;
            it('set', () => {
                clientStorage.set(sessionStorageKey, sessionStorageValue, clientStorage.STORAGE_SESSION);
                expect(sessionStorage.setItem).toHaveBeenCalledWith(sessionStorageKey, sessionStorageValue);
            });

            it('get', () => {
                clientStorage.get(sessionStorageKey, clientStorage.STORAGE_SESSION);
                expect(sessionStorage.getItem).toHaveBeenCalledWith(sessionStorageKey);
            });

            it('remove', () => {
                clientStorage.remove(sessionStorageKey, clientStorage.STORAGE_SESSION);
                expect(sessionStorage.removeItem).toHaveBeenCalledWith(sessionStorageKey);
            });
        });
    });

    describe('_getDomain', () => {
        let clientStorage: ClientStorageComponent;

        beforeEach(() => {
            clientStorage = getInstanceClientStorage();
            jest.spyOn(clientStorage, '_getDomain');
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should return null if shareBetweenSubdomains is false', () => {
            clientStorage.shareBetweenSubdomains = false;
            expect(clientStorage._getDomain()).toBeNull();
            expect(clientStorage._getDomain).toHaveBeenCalled();
        });

        it('should return host domain for subdomains when shareBetweenSubdomains is true', () => {
            clientStorage.shareBetweenSubdomains = true;

            Object.defineProperty(window, 'location', {
                value: {hostname: 'app.kozhin.dev'},
                writable: true,
            });

            expect(clientStorage._getDomain()).toBe('kozhin.dev');
            expect(clientStorage._getDomain).toHaveBeenCalled();
        });

        it('should return null if hostname is localhost', () => {
            clientStorage.shareBetweenSubdomains = true;

            Object.defineProperty(window, 'location', {
                value: {hostname: 'localhost'},
                writable: true,
            });

            expect(clientStorage._getDomain()).toBeNull();
        });

        it('should return null if hostname is an IP address', () => {
            clientStorage.shareBetweenSubdomains = true;

            Object.defineProperty(window, 'location', {
                value: {hostname: '127.0.0.1'},
                writable: true,
            });

            expect(clientStorage._getDomain()).toBeNull();
        });
    });

    afterAll(() => {
        global.Storage.prototype.mockReset(storageGetItem);
        global.Storage.prototype.mockReset(storageSetItem);
        global.Storage.prototype.mockReset(storageRemoveItem);
        delete global.Storage.prototype.mockReset;
        //Set the value that was before the tests
        process.env = env;
    });
});
