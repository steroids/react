import {indexBy} from '../../src/utils/collection';

describe('indexBy', () => {
    it('collection as object', () => {
        const collection = {};
        const key = 'id';
        expect(indexBy(collection, key)).toEqual(collection);
    });

    it('collection as array', () => {
        const indexKey = 'route';
        const homeValue = 'home';
        const dashboardValue = 'dashboard';

        const collection = [
            {
                [indexKey]: homeValue,
                isNavVisible: false,
                isVisible: true,
            },
            {
                [indexKey]: dashboardValue,
                isNavVisible: false,
                isVisible: false,
            },
        ];

        const expectedIndexedObject = {
            [homeValue]: collection[0],
            [dashboardValue]: collection[1],
        };

        expect(indexBy(collection, indexKey)).toEqual(expectedIndexedObject);
    });

    it('collection as null', () => {
        const collection = null;
        const key = 'notExistingKey';
        expect(indexBy(collection, key)).toEqual(collection);
    });
});
