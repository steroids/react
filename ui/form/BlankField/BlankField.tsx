import * as React from 'react';
import fieldHoc from '../fieldHoc';

interface IBlankFieldProps {
    label?: string | boolean;
    hint?: string;
    attribute?: string;
    text?: string | React.ReactNode;
    isInvalid?: boolean;
    view?: any;
}

@fieldHoc({
    componentId: 'form.BlankField'
})
export default class BlankField extends React.PureComponent<IBlankFieldProps,
    {}> {
    render() {
        return <span>{this.props.text || this.props.children}</span>;
    }
}
