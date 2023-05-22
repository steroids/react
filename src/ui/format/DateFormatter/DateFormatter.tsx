import {useComponents} from '../../../hooks';

export interface IDateFormatterProps {

    /**
     * Формат даты
     * @example LL
     */
    format?: string;

    /**
     * Дата
     * @example 2023-09-11
     */
    value?: any;

    /**
     * Переопределение view React компонента для кастомизации отображения колонки
     * @example MyCustomView
     */
    view?: CustomView;

    [key: string]: any;
}

const defaultProps = {
    format: 'LL',
};

export default function DateFormatter(props: IDateFormatterProps): JSX.Element {
    const components = useComponents();

    if (!props.value) {
        return null;
    }
    return components.ui.renderView(props.view || 'format.DefaultFormatterView', {
        value: components.locale.moment(props.value).format(props.format || defaultProps.format),
    });
}
