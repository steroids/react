import '@testing-library/jest-dom';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import {CalendarSystem} from '../../../../src/ui/content';
import CalendarSystemMockView from './CalendarSystemMockView';
import CalendarSystemModalMockView from './CalendarSystemModalMockView';
import CalendarSystemEventGroupModalMockView from './CalendarSystemEventGroupModalMockView';
import {ICalendarSystemProps} from '../../../../src/ui/content/CalendarSystem/CalendarSystem';

describe('CalendarSystem', () => {
    const props: ICalendarSystemProps = {
        view: CalendarSystemMockView,
        eventBlock: {
            title: 'My Calendars',
            eventGroups: [],
        },
        calendarModalProps: {
            component: CalendarSystemModalMockView,
        },
        eventGroupModalProps: {
            component: CalendarSystemEventGroupModalMockView,
        },
        users: [
            {
                id: 16201,
                name: 'Susie Russell',
                caption: 'snake',
                eventsIds: [1, 2],
            },
        ],
    };

    const calendarSystemExpectedClassName = 'CalendarSystemView';

    //TODO исправить ошибку в тестах
    it.skip('should be in the document', () => {
        const {container, debug} = render(JSXWrapper(CalendarSystem, props));

        const calendarSystem = getElementByClassName(container, calendarSystemExpectedClassName);

        expect(calendarSystem).toBeInTheDocument();
    });
});
