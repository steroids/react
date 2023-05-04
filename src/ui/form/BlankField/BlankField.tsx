import * as React from 'react';

import fieldWrapper, {IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {IBaseFieldProps} from '../InputField/InputField';

export interface IBlankFieldProps extends IBaseFieldProps {
    text?: string | React.ReactNode;
    children?: React.ReactNode;
}

function BlankField(props: IBlankFieldProps & IFieldWrapperOutputProps): JSX.Element {
    return <span>{props.text || props.children || props.input?.value}</span>;
}

export default fieldWrapper<IBlankFieldProps>('BlankField', BlankField);
