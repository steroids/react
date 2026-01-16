import React from 'react';

import CalendarEnum from '../enums/CalendarType';

export const useCalendarType = (onChangeCalendarType?: (newType: string) => void) => {
    const [calendarType, setCalendarType] = React.useState(CalendarEnum.MONTH);

    const handleCalendarTypeChange = React.useCallback((newType: string) => {
        setCalendarType(newType);

        if (onChangeCalendarType) {
            onChangeCalendarType(newType);
        }
    }, [onChangeCalendarType]);

    return {
        handleCalendarTypeChange,
        calendarType,
    };
};
