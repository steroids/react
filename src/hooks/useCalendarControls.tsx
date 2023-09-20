/* eslint-disable no-unused-expressions */
import React from 'react';
import _isFunction from 'lodash-es/isFunction';
import CalendarEnum from '../enums/CalendarType';
import DateControlEnum from '../enums/DateControlType';

export const CAPTION_ELEMENT_BUTTON_QUERY = '.CalendarSystemView .CaptionElement__button_';

export const getCalendarControl = (control: string) => document.querySelector(`${CAPTION_ELEMENT_BUTTON_QUERY}${control}`) as HTMLElement;

const useCalendarControls = (calendarType: CalendarEnum, weekControls: {[key: string]: VoidFunction | null}) => {
    const applyControl = React.useCallback((control: DateControlEnum) => {
        const calendarControl = getCalendarControl(control as string);

        if (!calendarControl) {
            return;
        }

        if (calendarType === CalendarEnum.Month) {
            calendarControl.click();
        } else {
            _isFunction(weekControls[control as string])
                ? weekControls[control as string]()
                : calendarControl.click();
        }
    }, [calendarType, weekControls]);

    return {
        applyControl,
    };
};

export default useCalendarControls;
