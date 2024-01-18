import '@testing-library/jest-dom';
import TimeFormatter from '../../../src/ui/format/TimeFormatter';
import DefaultFormatterMockView from './DefaultFormatterMockView';

import {JSXWrapper, render} from '../../helpers';
import {ITimeFormatterProps} from '../../../src/ui/format/TimeFormatter/TimeFormatter';

describe('TimeFormatter tests', () => {
    const props = {
        view: DefaultFormatterMockView,
        value: '2018-05-04 16:15:00',
    } as ITimeFormatterProps;

    it('should be correct conversion time', () => {
        const {getByText} = render(JSXWrapper(TimeFormatter, props));
        const date = getByText('16:15');

        expect(date).toBeInTheDocument();
    });
});
