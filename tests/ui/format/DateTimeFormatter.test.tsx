import '@testing-library/jest-dom';
import DateTimeFormatter, {IDateTimeFormatterProps} from '../../../src/ui/format/DateTimeFormatter/DateTimeFormatter';
import DefaultFormatterMockView from './DefaultFormatterMockView';

import {JSXWrapper} from '../../helpers';
import {render} from '../../customRender';

describe('DateTimeFormatter tests', () => {
    const props = {
        view: DefaultFormatterMockView,
        value: '2018-05-04 16:15:00',
    } as IDateTimeFormatterProps;

    const wrapper = JSXWrapper(DateTimeFormatter, props);
    it('should be in the document and have class', () => {
        const {getByText} = render(wrapper);
        const date = getByText('May 4, 2018 4:15 PM');

        expect(date).toBeInTheDocument();
    });
});
