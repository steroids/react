import {indexBy} from '../../src/utils/collection';

describe('indexBy', () => {
    it('collection as not array', () => {
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
});
