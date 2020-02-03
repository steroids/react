import * as React from 'react';
import * as moment from 'moment';
import _get from 'lodash-es/get';
import {components} from '../../../hoc';

interface IDateTimeFormatterProps {
    attribute?: string;
    item?: any;
    value?: string;
    format?: string;
    timeZone?: string | boolean;
    language?: any;
    locale?: any;
}

@components('locale')
export default class DateTimeFormatter extends React.Component<IDateTimeFormatterProps> {
    static defaultProps = {
        format: 'LLL'
    };

    render() {
        const value =
            this.props.value || _get(this.props.item, this.props.attribute);
        if (!value) {
            return null;
        }
        const date =
            this.props.timeZone === false
                ? moment(value).locale(this.props.locale.language)
                : this.props.locale.moment(value);
        return date.format(this.props.format);
    }
}
