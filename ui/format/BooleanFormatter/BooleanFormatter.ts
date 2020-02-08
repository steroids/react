import * as React from 'react';
import {formatter} from '../../../hoc';
import {IFormatterHocInput, IFormatterHocOutput} from '../../../hoc/formatter';

export interface IBooleanFormatterProps extends IFormatterHocInput {
    value?: string | number | boolean;
}

interface IBooleanFormatterPrivateProps extends IFormatterHocOutput {

}

@formatter()
export default class BooleanFormatter extends React.Component<IBooleanFormatterProps & IBooleanFormatterPrivateProps> {
    render() {
        return this.props.value ? __('Да') : __('Нет');
    }
}
