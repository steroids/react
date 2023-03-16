import * as React from 'react';
import {useBem} from '../../../../src/hooks';
import {IBemHocOutput} from '../../../../src/hoc/bem';
import {IRadioListFieldViewProps} from '../../../../src/ui/form/RadioListField/RadioListField';
import useUniqueId from '../../../../src/hooks/useUniqueId';

export default function RadioListFieldView(props: IRadioListFieldViewProps & IBemHocOutput) {
    const bem = useBem('RadioListFieldView');
    const prefix = useUniqueId('radio');

    return (
        <div className={bem.block()}>
            {props.items.map((item, index) => (
                <div
                    key={typeof item.id !== 'boolean' ? item.id : (item.id ? 'true' : 'false')}
                    className={bem(
                        bem.element('item', {
                            hasError: !!props.errors,
                        }),
                        props.className,
                    )}
                >
                    <input
                        {...props.inputProps}
                        id={`${prefix}_${item.id}`}
                        tabIndex={index}
                        className={bem(
                            bem.element('input', {
                                checked: props.selectedIds.includes(item.id),
                            }),
                        )}
                        checked={props.selectedIds.includes(item.id)}
                        disabled={props.disabled || item.disabled}
                        onChange={() => {
                            props.onItemSelect(item.id);
                        }}
                    />
                    <label
                        htmlFor={`${prefix}_${item.id}`}
                        className={bem.element('label')}
                    >
                        {item.label}
                    </label>
                </div>
            ))}
        </div>
    );
}
