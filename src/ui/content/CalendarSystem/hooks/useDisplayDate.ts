import React from 'react';
import _upperFirst from 'lodash-es/upperFirst';
import {convertDate} from '../../../../utils/calendar';

export const MONTH_CONVERT_FORMAT = 'MMMM YYYY';

const getFirstDayOfCurrentMonth = () => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return firstDayOfMonth;
};

const convertDateToRequiredFormat = (date: Date) => convertDate(date, null, MONTH_CONVERT_FORMAT);

const useDisplayDate = () => {
    const [dateToDisplay, setDateToDisplay] = React.useState(_upperFirst(convertDateToRequiredFormat(getFirstDayOfCurrentMonth())));

    const setNewDateToDisplay = (newDate: Date) => {
        setDateToDisplay(convertDateToRequiredFormat(newDate));
    };

    return {
        dateToDisplay,
        setNewDateToDisplay,
    };
};

export default useDisplayDate;
