import '@testing-library/jest-dom';
import CalendarSystemEventGroupModalMockView from './CalendarSystemEventGroupModalMockView';
import CalendarSystemMockView from './CalendarSystemMockView';
import CalendarSystemModalMockView from './CalendarSystemModalMockView';
import {CalendarSystem} from '../../../../src/ui/content';
import {ICalendarSystemProps} from '../../../../src/ui/content/CalendarSystem/CalendarSystem';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

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
