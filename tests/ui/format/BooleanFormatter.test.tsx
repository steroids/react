import '@testing-library/jest-dom';
import BooleanFormatter from '../../../src/ui/format/BooleanFormatter/BooleanFormatter';
import BooleanFormatterMockView from './BooleanFormatterMockView';

import {JSXWrapper, render} from '../../helpers';

describe('BooleanFormatter tests', () => {
    const props = {
        view: BooleanFormatterMockView,
    };

    it('should be true', () => {
        const value = 1;
        const {getByText} = render(JSXWrapper(BooleanFormatter, {
            ...props,
            value,
        }));
        const booleanFormatter = getByText('Да');

        expect(booleanFormatter).toBeInTheDocument();
    });

    it('should be false', () => {
        const value = 0;
        const {getByText} = render(JSXWrapper(BooleanFormatter, {
            ...props,
            value,
        }));
        const booleanFormatter = getByText('Нет');

        expect(booleanFormatter).toBeInTheDocument();
    });
});
