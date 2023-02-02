import Enum from '../../src/base/Enum';
import {normalizeItems, shouldUpdate, shouldUpdateSingle} from '../../src/utils/data';

describe('data utils', () => {
    describe('normalizeItems', () => {
        describe('items as array', () => {
            it('list of strings/numbers', () => {
                const item1 = "I'am item1";
                const item2 = 1337;

                const items = [item1, item2];

                const expectedNormalizedItems = [
                    {
                        id: item1,
                        label: item1,
                    },
                    {
                        id: item2,
                        label: item2,
                    },
                ];

                expect(normalizeItems(items)).toEqual(expectedNormalizedItems);
            });

            it('labels as ids', () => {
                const item1 = {
                    label: 'potato',
                    size: 'large',
                };
                const item2 = {
                    label: 'chips',
                    size: 'small',
                };
                const item3 = {
                    label: 'potato',
                    size: 'medium',
                };

                const items = [item1, item2, item3];

                const expectedNormalizedItems = [
                    {
                        id: item1.label,
                        ...item1,
                    },
                    {
                        id: item2.label,
                        ...item2,
                    },
                ];

                expect(normalizeItems(items)).toEqual(expectedNormalizedItems);
            });
        });

        describe('items as enum', () => {
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
            }

            it('default behavior', () => {
                const expectedNormalizedEnumArray = [
                    {
                        id: TestEnum.FIELD_1,
                        label: TestEnum.getLabel(TestEnum.FIELD_1),
                    },
                    {
                        id: TestEnum.FIELD_2,
                        label: TestEnum.getLabel(TestEnum.FIELD_2),
                    },
                    {
                        id: TestEnum.FIELD_3,
                        label: TestEnum.getLabel(TestEnum.FIELD_3),
                    },
                ];

                expect(normalizeItems(TestEnum)).toEqual(expectedNormalizedEnumArray);
            });
        });
    });

    //TODO checkCondition, filterItems

    describe('shouldUpdateSingle', () => {
        it('parameters as functions', () => {
            const func1 = () => 1 + 1;
            const func2 = () => 2 + 2;
            const expectedShouldUpdateSingle = false;
            expect(shouldUpdateSingle(func1, func2)).toBe(expectedShouldUpdateSingle);
        });

        it('parameters as primitives', () => {
            const param1 = 'What am I testing? :)';
            const param2 = 'What am I testing? :)';
            const expectedShouldUpdateSingle = false;
            expect(shouldUpdateSingle(param1, param2)).toBe(expectedShouldUpdateSingle);
        });
    });

    describe('shouldUpdate', () => {
        const pilafRecipe = {
            recipe: 'Pilaf',
            firstIngredient: 'rice',
            secondIngredient: 'beef',
            thirdIngredient: 'carrot',
            fourthIngredient: 'garlic',
            fifthIngredient: 'Suneli hops',
            action: 'Mix it all together and stew 2 hours',
            other: 'Salt and pepper by your choice',
        };

        const sandwichRecipe = {
            recipe: 'Sandwich',
            firstIngredient: 'white bread',
            secondIngredient: 'cervelat',
            thirdIngredient: 'butter',
            fourthIngredient: 'cheese',
            action: 'Lay it on top of each other from the bottom up',
            other: 'Put in microwave for 1 minute by your choice',

        };

        it('without deepPaths and different objects', () => {
            const expectedShouldUpdate = true;
            expect(shouldUpdate(pilafRecipe, sandwichRecipe)).toBe(expectedShouldUpdate);
        });

        it('without deepPaths and same objects', () => {
            const expectedShouldUpdate = false;
            expect(shouldUpdate(sandwichRecipe, sandwichRecipe)).toBe(expectedShouldUpdate);
        });

        //TODO isIt Working?
        it('with deepPaths and different objects', () => {
            const deepPaths = ['recipe', 'homemadeFood', 'delicious'];

            // expect(shouldUpdate(pilafRecipe, sandwichRecipe));
            console.log(shouldUpdate(pilafRecipe, sandwichRecipe, deepPaths));
        });
    });
});
