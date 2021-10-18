import * as React from 'react';

import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

export interface IBlankFieldProps extends IFieldWrapperInputProps {
    text?: string | React.ReactNode;
    children?: React.ReactNode;
}

function BlankField(props: IBlankFieldProps & IFieldWrapperOutputProps): JSX.Element {
    return <span>{props.text || props.children}</span>;
}

export default fieldWrapper('BlankField', BlankField);
