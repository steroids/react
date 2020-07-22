import * as React from 'react';
import moment from 'moment';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IDateTimeFormatterProps{
    format?: string;
    timeZone?: string | boolean;
    view?: CustomView;
    value?: any;
}

@components('locale','ui')
export default class DateTimeFormatter extends React.Component<IDateTimeFormatterProps & IComponentsHocOutput> {

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

        const DateTimeFormatterView = this.props.view || this.props.ui.getView('format.DefaultFormatterView');
        return <DateTimeFormatterView
            value={date.format(this.props.format)}
        />;
    }

}
