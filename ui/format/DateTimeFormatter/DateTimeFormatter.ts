import * as React from 'react';
import * as moment from 'moment';
import {components, formatter} from '../../../hoc';
import {IFormatterHocInput, IFormatterHocOutput} from '../../../hoc/formatter';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IDateTimeFormatterProps extends IFormatterHocInput {
    format?: string;
    timeZone?: string | boolean;
}

interface IDateTimeFormatterPrivateProps extends IFormatterHocOutput, IComponentsHocOutput {

}

@formatter()
@components('locale')
export default class DateTimeFormatter extends React.Component<IDateTimeFormatterProps & IDateTimeFormatterPrivateProps> {

    static defaultProps = {
        format: 'LLL'
    };

    render() {
        if (!this.props.value) {
            return null;
        }
        const date =
            this.props.timeZone === false
                ? moment(this.props.value).locale(this.props.locale.language)
                : this.props.locale.moment(this.props.value);
        return date.format(this.props.format);
    }

}
