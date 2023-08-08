import React from 'react';

export const useDateData = () => {
    const getFirstDayOfCurrentMonth = React.useCallback(() => {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        return firstDayOfMonth;
    }, []);

    const getCurrentMonth = (): number => {
        const currentDate = new Date();
        return currentDate.getMonth();
    };

    const getCurrentYearUTC = (): number => {
        const currentDate = new Date();
        return currentDate.getUTCFullYear();
    };

    return {
        getFirstDayOfCurrentMonth,
        getCurrentMonth,
        getCurrentYearUTC,
    };
};
