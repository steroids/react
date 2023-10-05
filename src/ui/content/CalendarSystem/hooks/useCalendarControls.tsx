/* eslint-disable no-unneeded-ternary */
/* eslint-disable default-case */
/* eslint-disable no-unused-expressions */
import React from 'react';
import _isFunction from 'lodash-es/isFunction';
import _get from 'lodash-es/get';
import CalendarEnum from '../enums/CalendarType';
import DateControlEnum from '../enums/DateControlType';

const CUSTOM_CONTROL_PATH = 'dataset.control';

export const getSourceCalendarControl = (control: string) => document.querySelector(`[data-sourcecontrol="${control}"]`) as HTMLElement;

const useCalendarControls = (calendarType: CalendarEnum, weekControls: {[key: string]: () => void | DateControlEnum}) => {
    const getCustomControlType = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLDivElement;
        const customControlType: DateControlEnum = _get(target, CUSTOM_CONTROL_PATH);

        return customControlType ? customControlType : null;
    };

    const applyControl = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        const customControlType = getCustomControlType(event);

        const sourceCalendarControl = getSourceCalendarControl(customControlType as string);

        if (!sourceCalendarControl) {
            return;
        }

        switch (calendarType) {
            case CalendarEnum.MONTH: {
                sourceCalendarControl.click();
                return;
            }
            case CalendarEnum.WEEK: {
                if (_isFunction(weekControls[customControlType as string])) {
                    weekControls[customControlType as string]();
                } else {
                    const sourceControlType = weekControls[customControlType as string] as DateControlEnum;

                    getSourceCalendarControl(sourceControlType as string).click();
                }
            }
        }
    }, [calendarType, weekControls]);

    return applyControl;
};

export default useCalendarControls;
