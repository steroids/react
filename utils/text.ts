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

// eslint-disable-next-line import/prefer-default-export
export const smartSearch = (query, sourceItems) => {
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
            const isMatch = !char.match(/[\p{Lu}]/u)
                ? wordChar.toLowerCase() === char.toLowerCase()
                : wordChar === char;
            if (isMatch) {
                index += 1;
                wordCharIndex += 1;
                highlighted[highlighted.length - 1][0] += wordChar;
                highlighted[highlighted.length - 1][1] = true;
            } else {
                highlighted.push([word.substr(wordCharIndex), false]);
                highlighted.push(['', false]);
                wordIndex += 1;
                wordCharIndex = 0;
            }
        }
        highlighted = highlighted.filter(highlightedItem => !!highlightedItem[0]);
        if (highlighted.findIndex(highlightedItem => highlightedItem[1]) !== -1) {
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
