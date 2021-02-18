import * as React from 'react';

import {IFieldHocInput} from '../../../hoc/field';
import {fieldWrapper, IFieldWrapperProps} from '../../../hooks/form';

interface IBlankFieldProps extends IFieldHocInput {
    text?: string | React.ReactNode;
    children?: React.ReactNode;
}

function BlankField(props: IBlankFieldProps & IFieldWrapperProps) {
    return <span>{props.text || props.children}</span>;
}

export default fieldWrapper('BlankField')(BlankField);
