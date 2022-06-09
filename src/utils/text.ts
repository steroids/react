import _orderBy from 'lodash-es/orderBy';

const stringToWords = str => {
    let words = [];
    String(str).split(' ').forEach(strItem => {
        words = words.concat(strItem.match(/^[^\p{Lu}]+/u));
        words = words.concat(strItem.match(/[\p{Lu}][^\p{Lu}]*/gu));
        words.push(' ');
    });
    words.pop();
    return words.filter(Boolean);
};


interface ISmartSearchSourceItem {
    id: string | number,
    label: string | number,
}

interface ISmartSearchOutputItem extends ISmartSearchSourceItem {
    labelHighlighted?: [string, boolean][];
}

export type TSmartSearchOutput = ISmartSearchOutputItem[];

/**
 * Регистронезависимый поиск.
 *
 * @param query
 * @param sourceItems
 */
// eslint-disable-next-line import/prefer-default-export
export const smartSearch = (query: string, sourceItems: ISmartSearchSourceItem[]): TSmartSearchOutput => {
    if (!query) {
        return sourceItems;
    }
    const queryCharacters = query.split('');
    // Match
    let items = sourceItems.filter(item => {
        const id = item.id;
        const words = stringToWords(item.label || '');
        if (words.length === 0 || !id) {
            return false;
        }
        let word = null;
        let highlighted = [['', false]];
        let index = 0;
        let wordIndex = 0;
        let wordChar = null;
        let wordCharIndex = 0;
        let prevIsMatch = false;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const char = queryCharacters[index];
            if (!char) {
                highlighted.push([
                    word.substr(wordCharIndex) + words.slice(wordIndex + 1).join(''),
                    false,
                ]);
                break;
            }
            word = words[wordIndex];
            wordChar = (word && word.split('')[wordCharIndex]) || '';
            if (!word) {
                highlighted = [];
                break;
            }
            const isMatch = wordChar.toLowerCase() === char.toLowerCase();

            if (isMatch) {
                index += 1;
                wordCharIndex += 1;
                highlighted[highlighted.length - 1][0] += wordChar;
                highlighted[highlighted.length - 1][1] = true;
                prevIsMatch = true;
            } else {
                if (!prevIsMatch) {
                    index = 0;
                }

                highlighted.push([word.substr(wordCharIndex), false]);
                highlighted.push(['', false]);
                wordIndex += 1;
                wordCharIndex = 0;
                prevIsMatch = false;
            }
        }
        highlighted = highlighted.filter(highlightedItem => !!highlightedItem[0]);
        if (highlighted.findIndex(highlightedItem => highlightedItem[1]) !== -1) {
            // @ts-ignore
            item.labelHighlighted = highlighted;
            return true;
        }
        return false;
    });
    items = _orderBy(
        items,
        item => {
            // Fined first word is priority
            if (item.labelHighlighted) {
                return item.labelHighlighted.findIndex(i => i[1]);
            }
            return Infinity;
        },
        'asc',
    );

    return items;
};
