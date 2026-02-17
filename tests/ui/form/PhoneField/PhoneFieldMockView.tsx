import React from 'react';
import {useBem} from '@steroidsjs/core/hooks';
import useUniqueId from '@steroidsjs/core/hooks/useUniqueId';
import {IPhoneFieldViewProps} from '@steroidsjs/core/ui/form/PhoneField/PhoneField';
import {Icon} from '@steroidsjs/core/ui/content';
import DropDownCountySelectMockView from './DropDownCountySelectMockView';

const PhoneFieldView = (props: IPhoneFieldViewProps) => {
    const bem = useBem('PhoneFieldView');
    const id = useUniqueId('phoneField');

    return (
        <div
            className={bem(
                bem.block({
                    disabled: props.disabled,
                    size: props.size,
                    hasError: !!props.errors,
                    hasClearIcon: props.showClear && !props.disabled,
                    filled: !!props.inputProps.value || !!props.input.value,
                }),
                props.className,
            )}
            style={props.style}
        >
            <div
                className={bem.element('input-wrapper')}
            >
                <div className={bem.element('addon-before')}>
                    <DropDownCountySelectMockView
                        {...props.dropDownProps}
                        disabled={props.disabled}
                    />
                </div>
                <input
                    onBlur={props.onBlur}
                    onFocus={props.onFocus}
                    onMouseDown={props.onMouseDown}
                    className={bem.element('input', {
                        size: props.size,
                    })}
                    {...props.inputProps}
                    placeholder={props.inputProps.placeholder}
                    disabled={props.disabled}
                    required={props.required}
                    id={id}
                    ref={props.inputRef}
                />
                {!props.disabled && props.showClear && !!props.inputProps.value && (
                    <Icon
                        name='cross_8x8'
                        className={bem.element('icon-clear')}
                        tabIndex={-1}
                        onClick={props.onClear}
                    />
                )}
            </div>
        </div>
    );
};

export default PhoneFieldView;
