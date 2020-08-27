import * as React from 'react';

import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {field} from '../../../hoc';

interface IBlankFieldProps extends IFieldHocInput {
    text?: string | React.ReactNode;
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
