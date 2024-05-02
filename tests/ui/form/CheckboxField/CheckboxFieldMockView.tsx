import * as React from 'react';
import {useBem, useUniqueId} from '../../../../src/hooks';
import {ICheckboxFieldViewProps} from '../../../../src/ui/form/CheckboxField/CheckboxField';

export default function CheckboxFieldView(props: ICheckboxFieldViewProps) {
    const bem = useBem('CheckboxFieldView');
    const id = useUniqueId('checkbox');

    const customVariableColorStyle = {'--checkbox-custom-color': props.color} as React.CSSProperties;

    return (
        <div
            className={bem(
                bem.block({
                    size: props.size,
                    hasErrors: !!props.errors,
                }),
                props.className,
            )}
            style={{
                ...props.style,
                ...customVariableColorStyle,
            }}
            onClick={props.onChange}
            role='button'
            aria-hidden
        >
            <input
                className={bem.element('input', {
                    hasCustomColor: !!props.color,
                })}
                id={props.id || id}
                disabled={props.disabled}
                required={props.required}
                {...props.inputProps}
            />
            <label
                className={bem.element('label', {
                    'has-label-only': !props.id,
                })}
                htmlFor={props.id || id}
            >
                {props.label && (
                    <span className={bem.element('label-text', {required: props.required})}>
                        {props.label}
                    </span>
                )}
            </label>
        </div>
    );
}
