import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

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

@components('locale','ui')
export default class DateFormatter extends React.Component<IDateFormatterProps & IComponentsHocOutput> {

    static defaultProps = {
        format: 'LL'
    };

    render() {
        if (!this.props.value) {
            return null;
        }
        const DateFormatterView = this.props.view || this.props.ui.getView('format.DefaultFormatterView');
        return <DateFormatterView
            value={this.props.locale.moment(this.props.value).format(this.props.format)}
        />;
    }

}
