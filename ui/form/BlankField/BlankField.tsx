import * as React from 'react';
import {field} from "../../../hoc";
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';

interface IBlankFieldProps extends IFieldHocInput {
    label?: string | boolean | any;
    hint?: string;
    attribute?: string;
    text?: string | React.ReactNode;
    isInvalid?: boolean;
    view?: any;
}

interface IBlankFieldPrivateProps extends IBlankFieldProps, IFieldHocOutput {

}

@field({
    componentId: 'form.BlankField'
})
export default class BlankField extends React.PureComponent<IBlankFieldProps & IBlankFieldPrivateProps> {
    render() {
        return <span>{this.props.text || this.props.children}</span>;
    }
}
