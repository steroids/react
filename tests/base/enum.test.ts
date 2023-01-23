import Enum from '../../src/base/Enum';

class TestEnum extends Enum {
    static FIELD_1 = 'field1';

    static FIELD_2 = 'field2';

    static FIELD_3 = 'field3';

    static getLabels() {
        return {
            [this.FIELD_1]: 'label1',
            [this.FIELD_2]: 'label2',
            [this.FIELD_3]: 'label3',
        };
    }

    static getCssClasses() {
        return {
            [this.FIELD_1]: 'orange',
            [this.FIELD_2]: 'white',
            [this.FIELD_3]: 'black',
        };
    }
}

describe('Enum', () => {
    it('getLabels', () => {
        const expectedLabels = {
            [TestEnum.FIELD_1]: 'label1',
            [TestEnum.FIELD_2]: 'label2',
            [TestEnum.FIELD_3]: 'label3',
        };

        expect(TestEnum.getLabels()).toEqual(expectedLabels);
    });

    describe('getLabel', () => {
        it('correct', () => {
            const expectedLabel = 'label1';

            expect(TestEnum.getLabel(TestEnum.FIELD_1)).toBe(expectedLabel);
        });
        it('incorrect', () => {
            const mockIncorrectLabel = 'Test';

            expect(TestEnum.getLabel(mockIncorrectLabel)).toBe('');
        });
    });

    it('getKeys', () => {
        const expectedKeys = [
            TestEnum.FIELD_1,
            TestEnum.FIELD_2,
            TestEnum.FIELD_3,
        ];

        expect(TestEnum.getKeys()).toEqual(expectedKeys);
    });

    it('getDropdownItems', () => {
        const expectedDropdownItems = [
            {label: 'label1', id: TestEnum.FIELD_1},
            {label: 'label2', id: TestEnum.FIELD_2},
            {label: 'label3', id: TestEnum.FIELD_3},
        ];

        expect(TestEnum.getDropdownItems()).toEqual(expectedDropdownItems);
    });

    it('getCssClasses', () => {
        const expectedCssClasses = {
            [TestEnum.FIELD_1]: 'orange',
            [TestEnum.FIELD_2]: 'white',
            [TestEnum.FIELD_3]: 'black',
        };

        expect(TestEnum.getCssClasses()).toEqual(expectedCssClasses);
    });

    describe('getCssClass', () => {
        it('correct', () => {
            const expectedCssClass = 'orange';

            expect(TestEnum.getCssClass(TestEnum.FIELD_1)).toEqual(
                expectedCssClass,
            );
        });

        it('incorrect', () => {
            const incorrectMockValue = 'Test';

            expect(TestEnum.getCssClass(incorrectMockValue)).toEqual('');
        });
    });
});
