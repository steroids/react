import {useComponents} from '../../../hooks';

/**
 * FileSize
 *
 * Компонент FileSize предназначен для форматирования размера файла в человеко-читаемом формате.
 * Он позволяет кастомизировать отображение размера файла, используя переданный view React компонент.
 **/
export interface IFileSizeProps extends IUiComponent {

    /**
     * Если не указан размер файла, то в случае, если showZero = true
     * то будет показан `0`, иначе пустая строка
     * @example true
     */
    showZero?: boolean;

    /**
     * Размер файла
     * @example 6920
     */
    value?: any;

    [key: string]: any;
}

export const asHumanFileSize = (bytes, showZero) => {
    if (!bytes) {
        return showZero ? '0' : '';
    }
    const thresh = 1000;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' ' + __('B');
    }
    const units = [
        __('kB'),
        __('MB'),
        __('GB'),
        __('TB'),
        __('PB'),
        __('EB'),
        __('ZB'),
        __('YB'),
    ];
    let u = -1;
    do {
        bytes /= thresh;
        u += 1;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
};

export default function FileSize(props: IFileSizeProps): JSX.Element {
    return useComponents().ui.renderView(props.view || 'format.DefaultFormatterView', {
        value: asHumanFileSize(props.value, props.showZero),
    });
}
