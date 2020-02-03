import * as React from 'react';

interface IFileSizeProps {
    bytes?: number;
    showZero?: boolean;
}

export default class FileSize extends React.Component<IFileSizeProps, {}> {
    static asHumanFileSize(bytes, showZero) {
        if (!bytes) {
            return showZero ? '0' : "";
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
        return FileSize.asHumanFileSize(this.props.bytes, this.props.showZero);
    }
}
