import Enum from './Enum';

class TestEnum extends Enum {
    static FIELD_1 = 'field1';

    static FIELD_2 = 'field2';

    static FIELD_3 = 'field3';

    static CSS_FIELD_1 = 'orange';

    static CSS_FIELD_2 = 'white';

    static CSS_FIELD_3 = 'black';

    static getLabels() {
        return {
            FIELD_1: this.FIELD_1,
            FIELD_2: this.FIELD_2,
            FIELD_3: this.FIELD_3,
        };
    }

    static getCssClasses() {
        return {
            CSS_FIELD_1: this.CSS_FIELD_1,
            CSS_FIELD_2: this.CSS_FIELD_2,
            CSS_FIELD_3: this.CSS_FIELD_3,
        };
    }
}

describe('Enum', () => {
    it('getLabels', () => {
        const expectedLabels = {
            FIELD_1: 'field1',
            FIELD_2: 'field2',
            FIELD_3: 'field3',
        };

        expect(TestEnum.getLabels()).toEqual(expectedLabels);
    });

    describe('getLabel', () => {
        it('correct', () => {
            expect(TestEnum.getLabel('FIELD_1')).toBe('field1');
        });
        it('incorrect', () => {
            expect(TestEnum.getLabel('Test')).toBe('');
        });
    });

    it('getKeys', () => {
        const expectedKeys = ['FIELD_1', 'FIELD_2', 'FIELD_3'];

        expect(TestEnum.getKeys()).toEqual(expectedKeys);
    });

    it('getDropdownItems', () => {
        const expectedDropdownItems = [
            { label: 'field1', id: 'FIELD_1' },
            { label: 'field2', id: 'FIELD_2' },
            { label: 'field3', id: 'FIELD_3' },
        ];

        expect(TestEnum.getDropdownItems()).toEqual(expectedDropdownItems);
    });

    it('getCssClasses', () => {
        const expectedCssClasses = {
            CSS_FIELD_1: 'orange',
            CSS_FIELD_2: 'white',
            CSS_FIELD_3: 'black',
        };

        expect(TestEnum.getCssClasses()).toEqual(expectedCssClasses);
    });

    describe('getCssClass', () => {
        it('correct', () => {
            expect(TestEnum.getCssClass('CSS_FIELD_1')).toEqual('orange');
        });

        it('incorrect', () => {
            expect(TestEnum.getCssClass('Test')).toEqual('');
        });
    });
});
