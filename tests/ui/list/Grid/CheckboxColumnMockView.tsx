import * as React from 'react';

import _get from 'lodash-es/get';
import {useBem} from '../../../../src/hooks';
import {ICheckboxColumnViewProps} from '../../../../src/ui/list/CheckboxColumn/CheckboxColumn';
import CheckboxField from '../../../../src/ui/form/CheckboxField';
import {IContentColumnViewProps} from '../../../../src/ui/list/Grid/Grid';

export default function CheckboxColumnView(props: ICheckboxColumnViewProps & IContentColumnViewProps) {
    const bem = useBem('CheckboxColumnView');
    const CheckboxFieldInternal = CheckboxField.WrappedComponent;

    return (
        <div className={bem.block()}>
            <CheckboxFieldInternal
                {...props.fieldProps}
                input={props.input}
                size={props.size}
                label={_get(props.item, props.attribute as string)}
            />
        </div>
    );
}
