import * as React from 'react';

import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import useField, { defineField } from '../../../hooks/field';

interface IBlankFieldProps extends IFieldHocInput {
    text?: string | React.ReactNode;
}

interface IBlankFieldPrivateProps extends IBlankFieldProps, IFieldHocOutput {

}

function BlankField(props: React.PropsWithChildren<IBlankFieldProps & IBlankFieldPrivateProps>) {
    props = useField('BlankField', props);
    return <span>{props.text || props.children}</span>;
}

export default defineField('BlankField')(BlankField);
