/* eslint-disable import/no-extraneous-dependencies */
import dayjs from 'dayjs';

import {useComponents} from '../../../hooks';
import {IDateFormatterProps} from '../DateFormatter/DateFormatter';

/**
 * DateTimeFormatter
 *
 * Компонент DateTimeFormatter предназначен для форматирования даты и времени с использованием заданного формата.
 * Он позволяет кастомизировать отображение даты и времени, используя переданный view React компонент.
 **/
export interface IDateTimeFormatterProps {
    /**
     * Формат даты
     * @example LLL
     */
    format?: string,

    /**
     * Показывать ли дату учитываю временную зону
     * @example true
     */
    timeZone?: string | boolean,

    /**
     * Дата
     * @example 2023-09-11
     */
    value?: any,

    /**
     * Переопределение view React компонента для кастомизации отображения колонки
     * @example MyCustomView
     */
    view?: CustomView,

    [key: string]: any,
}

const defaultProps = {
    format: 'LLL',
};

export default function DateTimeFormatter(receivedProps: IDateTimeFormatterProps): JSX.Element {
    const props = {
        ...defaultProps,
        ...receivedProps,
    };

    const components = useComponents();

    if (!props.value) {
        return null;
    }

    const date = props.timeZone === false
        ? dayjs(props.value).locale(components.locale.language)
        : components.locale.dayjs(props.value);

    return components.ui.renderView(props.view || 'format.DefaultFormatterView', {
        value: date.format(props.format),
    });
}
