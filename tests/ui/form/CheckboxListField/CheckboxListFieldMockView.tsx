import * as React from 'react';

import {ICheckboxListFieldViewProps} from '../../../../src/ui/form/CheckboxListField/CheckboxListField';
import {useBem} from '../../../../src/hooks';
import useUniqueId from '../../../../src/hooks/useUniqueId';

export default function CheckboxListFieldView(props: ICheckboxListFieldViewProps) {
    const bem = useBem('CheckboxListFieldView');
    const prefix = useUniqueId('checkbox');

    return (
        <div className={bem(bem.block({
            [`${props.orientation}`]: !!props.orientation,
        }))}
        >
            {props.items.map((checkbox, checkboxIndex) => props.renderItem({
                inputProps: {
                    name: `${prefix}_${checkbox.id}`,
                    checked: false,
                    type: 'checkbox',
                    disabled: false,
                    onChange: () => {
                        props.onItemSelect(checkbox.id);
                    },
                },
                disabled: props.disabled,
                label: checkbox.label,
                id: `${prefix}_${checkbox.id}`,
                key: checkboxIndex,
            }))}
        </div>
    );
}
