import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import useUniqueId from '../../../../src/hooks/useUniqueId';
import {ICheckboxListFieldViewProps} from '../../../../src/ui/form/CheckboxListField/CheckboxListField';

export default function RadioListFieldView(props: ICheckboxListFieldViewProps) {
    const bem = useBem('RadioListFieldView');
    const prefix = useUniqueId('radio');

    return (
        <div className={bem(
            bem.block({
                [`${props.orientation}`]: !!props.orientation,
            }),
            props.className,
        )}
        >
            {props.items.map((radio, radioIndex) => props.renderItem({
                key: radioIndex,
                id: `${prefix}_${radio.id}`,
                label: radio.label,
                inputProps: {
                    name: `${prefix}_${radio.id}`,
                    type: 'radio',
                    checked: props.selectedIds.includes(radio.id),
                    onChange: () => {
                        props.onItemSelect(radio.id);
                    },
                    disabled: props.disabled || radio.disabled,
                },
                size: radio.size || props.size,
                required: radio.required,
            }))}
        </div>
    );
}
