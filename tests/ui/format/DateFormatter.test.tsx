import '@testing-library/jest-dom';
import DefaultFormatterMockView from './DefaultFormatterMockView';
import DateFormatter, {IDateFormatterProps} from '../../../src/ui/format/DateFormatter/DateFormatter';
import {JSXWrapper, render} from '../../helpers';

describe('DateFormatter tests', () => {
    const props = {
        view: DefaultFormatterMockView,
        value: '2023-09-11',
    } as IDateFormatterProps;

    it('should be correct conversion date', () => {
        const {getByText} = render(JSXWrapper(DateFormatter, props));
        const date = getByText('September 11, 2023');

        expect(date).toBeInTheDocument();
    });
});
