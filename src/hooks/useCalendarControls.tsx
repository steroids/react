import React from 'react';
import DateControlEnum from '../enums/DateControlType';

const CAPTION_ELEMENT_BUTTON_QUERY = '.CalendarSystemView .CaptionElement__button_';

export const useCalendarControls = () => {
    const applyControl = React.useCallback((control: DateControlEnum) => {
        const calendarControl = document.querySelector(`${CAPTION_ELEMENT_BUTTON_QUERY}${control}`) as HTMLElement;

        if (!calendarControl) {
            return;
        }

        calendarControl.click();
    }, []);

    return {
        applyControl,
    };
};
