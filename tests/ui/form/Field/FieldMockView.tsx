import * as React from 'react';
import Field from '../../../../src/ui/form/Field';
import {IFieldProps} from '../../../../src/ui/form/Field/Field';

interface IFieldMockViewProps extends IFieldProps {
    testId: string,
}

export default (props: IFieldMockViewProps) => (
    <>
        <Field
            data-testid={props.testId}
            component={props.component}
            attribute={props.attribute}
        />
    </>
);
