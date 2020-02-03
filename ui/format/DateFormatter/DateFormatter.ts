import * as React from 'react';
import _get from 'lodash-es/get';
import {components} from '../../../hoc';

interface IDateFormatterProps {
    attribute?: string;
    item?: any;
    value?: string;
    format?: string;
    moment?: any;
    locale?: any;
}

@components('locale')
export default class DateFormatter extends React.Component<IDateFormatterProps> {
    static defaultProps = {
        format: 'LL'
    };

    render() {
        const value =
            this.props.value || _get(this.props.item, this.props.attribute);
        if (!value) {
            return null;
        }
        return this.props.locale.moment(value).format(this.props.format);
    }
}
