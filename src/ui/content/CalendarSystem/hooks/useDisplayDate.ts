import _upperFirst from 'lodash-es/upperFirst';
import {useMemo, useState} from 'react';

import {convertDate} from '../../../../utils/calendar';
import {IDay} from '../CalendarSystem';
import DisplayDateFormatType from '../enums/DisplayDateFormatType';

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
