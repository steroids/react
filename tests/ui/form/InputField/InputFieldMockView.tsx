/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import {IInputFieldViewProps} from '../../../../src/ui/form/InputField/InputField';
import {useBem} from '../../../../src/hooks';
import Icon from '../../../../src/ui/content/Icon';

import renderIcon from '../../../mocks/renderIconMock';

export default function InputFieldView(props: IInputFieldViewProps) {
    const bem = useBem('InputFieldView');

    return (
        <div
            className={bem(
                bem.block({
                    disabled: props.disabled,
                    size: props.size,
                    hasError: !!props.errors,
                    hasLeadIcon: !!props.leadIcon,
                    hasClearIcon: props.showClear && !props.disabled,
                    filled: !!props.input?.value,
                    hasAddonAfter: !!props.addonAfter,
                    hasAddonBefore: !!props.addonBefore,
                    hasAddon: !!props.addonAfter || !!props.addonBefore,
                    hasTextAddon: !!props.textAfter || !!props.textBefore,
                    hasTextAddonBefore: !!props.textBefore,
                    hasTextAddonAfter: !!props.textAfter,
                }),
                props.className,
            )}
            style={props.style}
        >
            {props.addonBefore && (
                <span className={bem.element('addon-before')}>
                    {props.addonBefore}
                </span>
            )}
            {props.textBefore && (
                <span className={bem.element('text-before')}>
                    {props.textBefore}
                </span>
            )}
            <div className={bem.element('input-wrapper')}>
                {props.leadIcon && renderIcon(props.leadIcon,
                    {
                        className: bem.element('lead-icon'),
                        tabIndex: -1,
                    })}
                {props.maskOptions
                    ? (
                        <input
                            onBlur={props.onBlur}
                            onFocus={props.onFocus}
                            onMouseDown={props.onMouseDown}
                            className={bem(
                                bem.element('input', {
                                    size: props.size,
                                }),
                            )}
                            {...props.inputProps}
                            type={props.inputProps.type}
                            placeholder={props.placeholder}
                            disabled={props.disabled}
                            required={props.required}
                            id={props.id}
                            ref={props.inputRef}
                        />
                    )
                    : (
                        <input
                            className={bem(
                                bem.element('input', {
                                    size: props.size,
                                }),
                            )}
                            {...props.inputProps}
                            type={props.inputProps?.type}
                            placeholder={props.placeholder}
                            disabled={props.disabled}
                            required={props.required}
                            id={props.id}
                            ref={props.inputRef}
                        />
                    )}
                {!props.disabled && props.showClear && !props.maskProps && (
                    <Icon
                        name="mockIcon"
                        className={bem.element('icon-clear')}
                        tabIndex={-1}
                        onClick={props.onClear}
                    />
                )}
            </div>
            {props.textAfter && (
                <span className={bem.element('text-after')}>
                    {props.textAfter}
                </span>
            )}
            {props.addonAfter && (
                <span className={bem.element('addon-after')}>
                    {props.addonAfter}
                </span>
            )}
        </div>
    );
}
