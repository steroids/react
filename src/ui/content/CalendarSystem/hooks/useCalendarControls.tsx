/* eslint-disable default-case */
import React from 'react';
import _isFunction from 'lodash-es/isFunction';
import _get from 'lodash-es/get';
import CalendarEnum from '../enums/CalendarType';
import DateControlEnum from '../enums/DateControlType';
import {getSourceCalendarControl} from '../utils/utils';

const CUSTOM_CONTROL_PATH = 'dataset.control';

const useCalendarControls = (
    calendarType: CalendarEnum,
    weekGridControls: {[key: string]: () => void | DateControlEnum},
) => {
    const extractCustomControlType = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLDivElement;
        const customControlType: DateControlEnum = _get(target, CUSTOM_CONTROL_PATH);

        return customControlType ?? null;
    };

    const handleControlClick = React.useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            const customControlType = extractCustomControlType(event);
            const sourceCalendarControl = getSourceCalendarControl(
                customControlType as string,
            );

            if (!sourceCalendarControl) {
                return;
            }

            switch (calendarType) {
                case CalendarEnum.MONTH: {
                    sourceCalendarControl.click();
                    return;
                }
                case CalendarEnum.WEEK: {
                    const controlAction = weekGridControls[
                        customControlType as string
                    ] as () => void;

                    if (_isFunction(controlAction)) {
                        controlAction();
                    } else {
                        const sourceControlType = controlAction as DateControlEnum;
                        getSourceCalendarControl(sourceControlType as string).click();
                    }
                }
            }
        },
        [calendarType, weekGridControls],
    );

    return handleControlClick;
};

export default useCalendarControls;
