import * as React from 'react';
import {IFormatterHocInput, IFormatterHocOutput} from '../../../hoc/formatter';
import {formatter} from '../../../hoc';

export interface IFileSizeFormatterProps extends IFormatterHocInput {
    showZero?: boolean;
}

interface IFileSizeFormatterPrivateProps extends IFormatterHocOutput {

}

@formatter()
export default class FileSize extends React.Component<IFileSizeFormatterProps & IFileSizeFormatterPrivateProps> {

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
        return this.props.renderValue(
            FileSize.asHumanFileSize(this.props.value, this.props.showZero)
        );
    }

}
