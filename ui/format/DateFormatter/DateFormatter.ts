import * as React from 'react';
import _get from 'lodash-es/get';
import {components, formatter} from '../../../hoc';
import {IFormatterHocInput, IFormatterHocOutput} from '../../../hoc/formatter';
import {IComponentsHocOutput} from '../../../hoc/components';

interface IDateFormatterProps extends IFormatterHocInput {
    format?: string;
}

interface IDateFormatterPrivateProps extends IFormatterHocOutput, IComponentsHocOutput {

}

@formatter()
@components('locale')
export default class DateFormatter extends React.Component<IDateFormatterProps & IDateFormatterPrivateProps> {

    static defaultProps = {
        format: 'LL'
    };

    render() {
        if (!this.props.value) {
            return null;
        }
        return this.props.locale.moment(this.props.value).format(this.props.format);
    }

}
