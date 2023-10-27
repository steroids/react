import '@testing-library/jest-dom';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import {CalendarSystem} from '../../../../src/ui/content';
import CalendarSystemMockView from './CalendarSystemMockView';
import CalendarSystemModalMockView from './CalendarSystemModalMockView';
import {ICalendarSystemProps} from '../../../../src/ui/content/CalendarSystem/CalendarSystem';

describe('CalendarSystem', () => {
    const props = {
        eventBlock: {
            title: 'My Calendars',
            view: CalendarSystemMockView,
            calendarModalProps: {
                component: CalendarSystemModalMockView,
            },
        },
    };

    const calendarSystemExpectedClassName = 'CalendarSystemView';

    it('should be in the document', () => {
        const {container, debug} = render(JSXWrapper(CalendarSystem, props));

        console.log(debug());
    });
});
