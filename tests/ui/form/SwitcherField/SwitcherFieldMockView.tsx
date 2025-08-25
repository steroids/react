/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {useCallback} from 'react';
import {useBem, useUniqueId} from '../../../../src/hooks';

import {ICheckboxFieldViewProps} from '../../../../src/ui/form/CheckboxField/CheckboxField';

export default function SwitcherFieldMockView(props: ICheckboxFieldViewProps) {
    const bem = useBem('SwitcherFieldView');
    const uniqueId = useUniqueId('switcher');

    const renderLabel = useCallback(() => {
        if (typeof props.label === 'object') {
            return props.inputProps.checked ? props.label.checked : props.label.unchecked;
        }

        return props.label;
    }, [props.inputProps.checked, props.label]);

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
        >
            <input
                id={props.id || uniqueId}
                disabled={props.disabled}
                required={props.required}
                className={bem.element('input')}
                {...props.inputProps}
            />
            <span className={bem.element('slider')} />
            <span className={bem.element('label')}>
                {
                    renderLabel()
                }
            </span>
        </div>
    );
}
