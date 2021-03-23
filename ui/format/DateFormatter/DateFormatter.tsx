import {useComponents} from '@steroidsjs/core/hooks';

export interface IDateFormatterProps {

    /**
     * Формат даты
     * @example LL
     */
    format?: string;
    view?: CustomView;

    /**
     * Дата
     * @example 2023-09-11
     */
    value?: any;

    [key: string]: any;
}

const defaultProps = {
    format: 'LL',
};

export default function DateFormatter(props: IDateFormatterProps) {
    const components = useComponents();

    if (!props.value) {
        return null;
    }
    return components.ui.renderView(props.view || 'format.DefaultFormatterView', {
        value: components.locale.moment(props.value).format(props.format || defaultProps.format),
    });
}
