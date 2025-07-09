/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import {useBem} from '../../../../src/hooks';
import useUniqueId from '../../../../src/hooks/useUniqueId';
import {ICheckboxFieldProps} from '../../../../src/ui/form/CheckboxField/CheckboxField';

export default function RadioFieldView(props: ICheckboxFieldProps) {
    const bem = useBem('RadioFieldView');
    const id = useUniqueId('radio');

    return (
        <div
            className={bem(
                bem.block({
                    hasError: !!props.errors,
                    size: props.size,
                }),
                props.className,
            )}
            onClick={props.onChange}
        >
            <input
                className={bem(
                    bem.element('input', {
                        checked: props.checked,
                    }),
                )}
                id={props.id || id}
                {...props.inputProps}
                checked={props.checked}
                disabled={props.disabled}
                required={props.required}
            />
            <label
                className={bem.element('label')}
                htmlFor={props.id || id}
            >
                <span className={bem.element('ellipse')} />
                {props.label}
            </label>
        </div>
    );
}
