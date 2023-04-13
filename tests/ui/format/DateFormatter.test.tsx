import '@testing-library/jest-dom';
import DateFormatter, {IDateFormatterProps} from '../../../src/ui/format/DateFormatter/DateFormatter';
import DefaultFormatterMockView from './DefaultFormatterMockView';

import {JSXWrapper} from '../../helpers';
import {render} from '../../customRender';

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
