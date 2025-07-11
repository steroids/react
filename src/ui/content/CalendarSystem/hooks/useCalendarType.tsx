import {useState, useCallback} from 'react';
import CalendarEnum from '../enums/CalendarType';

export const useCalendarType = (onChangeCalendarType?: (newType: string) => void) => {
    const [calendarType, setCalendarType] = useState(CalendarEnum.MONTH);

    const handleCalendarTypeChange = useCallback((newType: string) => {
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
