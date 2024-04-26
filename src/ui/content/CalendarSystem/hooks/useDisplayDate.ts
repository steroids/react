import {useMemo, useState} from 'react';
import _upperFirst from 'lodash-es/upperFirst';
import {convertDate} from '../../../../utils/calendar';
import DisplayDateFormatType from '../enums/DisplayDateFormatType';
import {IDay} from '../CalendarSystem';

const convertDateToRequiredFormat = (
    date: Date | string,
    toFormat,
) => convertDate(date, null, DisplayDateFormatType.getLabel(toFormat));

const useDisplayDate = (generalCurrentDay: IDay) => {
    const [displayFormat, setDisplayFormat] = useState<string>(DisplayDateFormatType.DEFAULT);

    const dateToDisplay = useMemo(() => _upperFirst(
        convertDateToRequiredFormat(generalCurrentDay.date, displayFormat),
    ), [displayFormat, generalCurrentDay.date]);

    const changeDisplayFormat = (newFormat: string) => {
        setDisplayFormat(newFormat);
    };

    return {
        dateToDisplay,
        displayFormat,
        changeDisplayFormat,
    };
};

export default useDisplayDate;
