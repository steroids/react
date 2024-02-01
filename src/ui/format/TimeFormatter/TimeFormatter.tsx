import {useComponents} from '@steroidsjs/core/hooks';
import dayjs from 'dayjs';

/**
 * TimeFormatter
 *
 * Компонент TimeFormatter предназначен для форматирования времени с использованием заданного формата.
 * Он позволяет кастомизировать отображение времени, используя переданный view React компонент.
 **/

export interface ITimeFormatterProps{
    /**
     * Формат времени
     * @example HH:mm
     */
    format?: string,

    /**
     * Время
     * @example 16:15
     */
    value?: string,

    /**
     * Переопределение view React компонента для кастомизации отображения колонки
     * @example MyCustomView
     */
    view?: CustomView,

    [key: string]: any,
}

const defaultProps = {
    format: 'HH:mm',
};

export default function TimeFormatter(props: ITimeFormatterProps): JSX.Element {
    const components = useComponents();

    if (!props.value) {
        return null;
    }

    const time = dayjs(props.value).format(props.format || defaultProps.format);

    return components.ui.renderView(props.view || 'format.DefaultFormatterView', {
        value: time,
    });
}
