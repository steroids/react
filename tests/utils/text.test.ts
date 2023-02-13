import {smartSearch} from '../../src/utils/text';

const itemRuLabel = 'Загромождена входная дверь в электрощитовую';
const itemEnLabel = 'this is a text in english language, wow';
const itemSymbolsLabel = '%Sym!bols *Lab**el';

const items1 = [
    {
        id: 1,
        label: 'A label',
    },
    {
        id: 2,
        label: 'Label a',
    },
];
const items2 = [
    {
        id: 1,
        label: itemRuLabel,
    },
    {
        id: 2,
        label: 'Входная дверь открывается во внутрь',
    },
    {
        id: 3,
        label: itemEnLabel,
    },
    {
        id: 4,
        label: 'English is a text in language',
    },
    {
        id: 5,
        label: itemSymbolsLabel,
    },
    {
        id: 6,
        label: 'внутрь - это не наружу',
    },
    {
        id: 7,
        label: 'наружу - это не во внутрь',
    },
    {
        id: 8,
        label: 'внутрь',
    },
];

const testResultHighlightedExpectedQueryLangRu1 = [
    [
        'Загро',
        true,
    ],
    [
        'мождена входная дверь в электрощитовую',
        false,
    ],
];
const testResultHighlightedExpectedQueryLangRu2 = [
    [
        'Загромождена',
        false,
    ],
    [
        ' ',
        false,
    ],
    [
        'входная',
        false,
    ],
    [
        ' ',
        false,
    ],
    [
        'дверь',
        false,
    ],
    [
        ' ',
        false,
    ],
    [
        'в',
        false,
    ],
    [
        ' ',
        false,
    ],
    [
        'электрощи',
        true,
    ],
    [
        'товую',
        false,
    ],
];

const testResultHighlightedExpectedQueryLangEn1 = [
    [
        'thi',
        true,
    ],
    [
        's is a text in english language, wow',
        false,
    ],
];
const testResultHighlightedExpectedQueryLangEn2 = [
    [
        'this',
        false,
    ],
    [
        ' ',
        false,
    ],
    [
        'is',
        false,
    ],
    [
        ' ',
        false,
    ],
    [
        'a',
        false,
    ],
    [
        ' ',
        false,
    ],
    [
        'text',
        false,
    ],
    [
        ' ',
        false,
    ],
    [
        'in',
        false,
    ],
    [
        ' ',
        false,
    ],
    [
        'english',
        false,
    ],
    [
        ' ',
        false,
    ],
    [
        'language,',
        false,
    ],
    [
        ' ',
        false,
    ],
    [
        'wow',
        true,
    ],
];

const testResultHighlightedExpectedOppositeLetterCase1 = testResultHighlightedExpectedQueryLangEn1;
const testResultHighlightedExpectedOppositeLetterCase2 = testResultHighlightedExpectedQueryLangEn2;

describe('textUtilsTest', () => {
    describe('smartSearchTest', () => {
        it('emptyArguments', () => {
            expect(smartSearch(null, [])).toEqual([]);
            expect(smartSearch(null, items1)).toEqual(items1);
            expect(smartSearch('', items1)).toEqual(items1);
            expect(smartSearch('', [])).toEqual([]);
            expect(smartSearch('l', [])).toEqual([]);

            expect(smartSearch('', null)).toEqual(null);
            expect(smartSearch(null, null)).toEqual(null);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(smartSearch()).toEqual(undefined);
            expect(() => smartSearch('l', null)).toThrow(TypeError);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(() => smartSearch('l')).toThrow(TypeError);
        });

        it('oneLetterInQuery', () => {
            const expected1 = [
                {
                    id: 2,
                    label: 'Label a',
                    labelHighlighted: [
                        [
                            'L',
                            true,
                        ],
                        [
                            'abel a',
                            false,
                        ],
                    ],
                },
                {
                    id: 1,
                    label: 'A label',
                    labelHighlighted: [
                        [
                            'A',
                            false,
                        ],
                        [
                            ' ',
                            false,
                        ],
                        [
                            'l',
                            true,
                        ],
                        [
                            'abel',
                            false,
                        ],
                    ],
                },
            ];

            expect(smartSearch('l', items1)).toEqual(expected1);

            expect(smartSearch('L', items1)).toEqual(expected1);
        });

        it('queryRu', () => {
            const result1 = smartSearch('загро', items2);
            expect(result1).toHaveLength(1);
            expect(result1[0].label).toEqual(itemRuLabel);
            expect(result1[0].labelHighlighted).toEqual(testResultHighlightedExpectedQueryLangRu1);

            const result2 = smartSearch('электрощи', items2);
            expect(result2).toHaveLength(1);
            expect(result2[0].id).toEqual(1);
            expect(result2[0].label).toEqual(itemRuLabel);
            expect(result2[0].labelHighlighted).toEqual(testResultHighlightedExpectedQueryLangRu2);
        });

        it('queryEn', () => {
            const result1 = smartSearch('thi', items2);
            expect(result1).toHaveLength(1);
            expect(result1[0].id).toEqual(3);
            expect(result1[0].label).toEqual(itemEnLabel);
            expect(result1[0].labelHighlighted).toEqual(testResultHighlightedExpectedQueryLangEn1);

            const result2 = smartSearch('wow', items2);
            expect(result2).toHaveLength(1);
            expect(result2[0].id).toEqual(3);
            expect(result2[0].label).toEqual(itemEnLabel);
            expect(result2[0].labelHighlighted).toEqual(testResultHighlightedExpectedQueryLangEn2);
        });

        it('oppositeLetterCase', () => {
            const result1 = smartSearch('Thi', items2);
            expect(result1).toHaveLength(1);
            expect(result1[0].id).toEqual(3);
            expect(result1[0].label).toEqual(itemEnLabel);
            expect(result1[0].labelHighlighted).toEqual(testResultHighlightedExpectedOppositeLetterCase1);

            const result2 = smartSearch('WOW', items2);
            expect(result2).toHaveLength(1);
            expect(result2[0].id).toEqual(3);
            expect(result2[0].label).toEqual(itemEnLabel);
            expect(result2[0].labelHighlighted).toEqual(testResultHighlightedExpectedOppositeLetterCase2);

            expect(smartSearch('ОтКрЫваеТся ВО', items2)).toHaveLength(1);
        });

        it('countOfMatchesResult', () => {
            const result1 = smartSearch('двер', items2);
            expect(result1).toHaveLength(2);

            const result2 = smartSearch('внутр', items2);
            expect(result2).toHaveLength(4);

            const result3 = smartSearch('bom', items2);
            expect(result3).toHaveLength(0);
        });

        it('manyWordsInQuery', () => {
            expect(smartSearch('Входная дверь открывается', items2)).toHaveLength(1);
            expect(smartSearch('is a text in', items2)).toHaveLength(2);
            expect(smartSearch('открывается во', items2)).toHaveLength(1);
        });

        // todo надо ли делать поиск по небуквенным символам?? сейчас он работает некорректно
        // it('querySymbols', () => {
        // const result1HighlightedExpected1 = [
        //     [
        //         '%',
        //         false,
        //     ],
        //     [
        //         'Sym!bols',
        //         false,
        //     ],
        //     [
        //         ' ',
        //         false,
        //     ],
        //     [
        //         '*',
        //         true,
        //     ],
        //     [
        //         'Lab**el',
        //         false,
        //     ],
        // ];
        // const result1HighlightedExpected2 = [
        //     [
        //         '%',
        //         true,
        //     ],
        //     [
        //         'Sym!bols',
        //         true,
        //     ],
        //     [
        //         ' *Lab**el',
        //         false,
        //     ],
        // ];
        //
        // const result1 = smartSearch('*', items2);
        // expect(result1).toHaveLength(1);
        // expect(result1[0].id).toEqual(5);
        // expect(result1[0].label).toEqual(itemSymbolsLabel);
        // expect(result1[0].labelHighlighted).toEqual(result1HighlightedExpected1);
        //
        // const result2 = smartSearch('%Sym!bols', items2);
        // expect(result2).toHaveLength(1);
        // expect(result2[0].id).toEqual(5);
        // expect(result2[0].label).toEqual(itemSymbolsLabel);
        // expect(result2[0].labelHighlighted).toEqual(result1HighlightedExpected2);
        // });
    });
});
