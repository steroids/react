import * as React from 'react';
import {IBemHocOutput} from '../../../../src/hoc/bem';
import {useBem, useUniqueId} from '../../../../src/hooks';
import {ICheckboxFieldViewProps} from '../../../../src/ui/form/CheckboxField/CheckboxField';

export default function CheckboxFieldView(props: ICheckboxFieldViewProps & IBemHocOutput) {
    const bem = useBem('CheckboxFieldView');
    const id = useUniqueId('checkbox');

    return (
        <div
            className={
                `${bem.block()} 
                 ${bem(props.className)}
                 ${props.errors ? 'has-errors' : ''}`
            }
            style={props.style}
        >
            <input
                className={bem(
                    bem.element('input'),
                )}
                id={id}
                {...props.inputProps}
                disabled={props.disabled}
                required={props.required}
                type="checkbox"
            />
            <label
                className={bem(
                    bem.element('label'),
                )}
                htmlFor={id}
            >
                <span className={bem.element('label-text', {required: props.required})}>
                    {props.label}
                </span>
            </label>
        </div>
    );
}
