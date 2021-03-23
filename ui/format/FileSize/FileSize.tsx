import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IFileSizeFormatterProps {

    /**
     * Если не указан размер файла, то в случае, если showZero = true
     * то будет показан `0`, иначе пустая строка
     * @example true
     */
    showZero?: boolean;
    view?: CustomView;

    /**
     * Размер файла
     * @example 6920
     */
    value?: any;

    [key: string]: any;
}

@components('ui')
export default class FileSize extends React.Component<IFileSizeFormatterProps & IComponentsHocOutput> {

    static asHumanFileSize(bytes, showZero) {
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
            __('YB')
        ];
        let u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
    }

    render() {
        const FileSizeFormatterView = this.props.view || this.props.ui.getView('format.DefaultFormatterView');
        return <FileSizeFormatterView
            value={ FileSize.asHumanFileSize(this.props.value, this.props.showZero)}
        />;
    }

}
