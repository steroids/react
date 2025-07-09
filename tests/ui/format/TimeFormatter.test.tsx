import '@testing-library/jest-dom';
import TimeFormatter from '../../../src/ui/format/TimeFormatter';
import {JSXWrapper, render} from '../../helpers';
import {ITimeFormatterProps} from '../../../src/ui/format/TimeFormatter/TimeFormatter';
import DefaultFormatterMockView from './DefaultFormatterMockView';

describe('TimeFormatter tests', () => {
    const props = {
        view: DefaultFormatterMockView,
        value: '2018-05-04 16:15:00',
    } as ITimeFormatterProps;

    const expectedTime = '16:15';

    it('should display the correct time when only the time is passed', () => {
        const {getByText} = render(JSXWrapper(TimeFormatter, props));
        const date = getByText(expectedTime);

        expect(date).toBeInTheDocument();
    });

    it('should display the correct time when a date object is passed', () => {
        const dateObj = new Date('2018-05-04 16:15:00');
        const propsWithDate = {
            ...props,
            value: dateObj,
        };

        const {getByText} = render(JSXWrapper(TimeFormatter, propsWithDate));
        const date = getByText(expectedTime);

        expect(date).toBeInTheDocument();
    });
});
