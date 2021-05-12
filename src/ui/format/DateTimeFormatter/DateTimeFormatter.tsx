import moment from 'moment';
import {useComponents} from '../../../hooks';
import {IDateFormatterProps} from '../DateFormatter/DateFormatter';

export interface IDateTimeFormatterProps {
    /**
     * Формат даты
     * @example LLL
     */
    format?: string;

    /**
     * Показывать ли дату учитываю временную зону
     * @example true
     */
    timeZone?: string | boolean;
    view?: CustomView;

    /**
     * Дата
     * @example 2023-09-11
     */
    value?: any;

    [key: string]: any;
}

function DateTimeFormatter(props: IDateFormatterProps): JSX.Element {
    const components = useComponents();

    if (!props.value) {
        return null;
    }

    const date = props.timeZone === false
        ? moment(props.value).locale(components.locale.language)
        : components.locale.moment(props.value);

    return components.ui.renderView(props.view || 'format.DefaultFormatterView', {
        value: date.format(props.format),
    });
}

DateTimeFormatter.defaultProps = {
    format: 'LLL',
};

export default DateTimeFormatter;
