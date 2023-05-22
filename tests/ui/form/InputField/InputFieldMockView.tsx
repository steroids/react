import * as React from 'react';

import {IInputFieldViewProps} from '../../../../src/ui/form/InputField/InputField';
import Icon from '../../../../src/ui/content/Icon';
import {useBem} from '../../../../src/hooks';
import IconMockView from '../../content/Icon/IconMockView';
import renderIcon from '../../../mocks/renderIconMock';

export default function InputFieldView(props: IInputFieldViewProps) {
    const bem = useBem('InputFieldView');

    const renderLeadIcon = React.useCallback(() => {
        if (!props.leadIcon) {
            return null;
        }

        const className = bem.element('lead-icon');

        return renderIcon(props.leadIcon,
            {
                className,
                tabIndex: -1,
            });
    }, [bem, props.leadIcon]);

    return (
        <div
            className={bem(
                bem.block({
                    disabled: props.inputProps?.disabled,
                    size: props.size,
                    hasError: !!props.errors,
                    hasLeadIcon: !!props.leadIcon,
                    hasClearIcon: props.showClear && !props.disabled,
                    filled: !!props.inputProps?.value,
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
                {props.leadIcon && renderLeadIcon()}
                {props.maskProps
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
                            type={props.type}
                            placeholder={props.placeholder}
                            disabled={props.disabled}
                            required={props.required}
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
                            onChange={e => props.input?.onChange(e.target.value)}
                            type={props.type}
                            placeholder={props.placeholder}
                            disabled={props.disabled}
                            required={props.required}
                        />
                    )}
                {!props.disabled && props.showClear && !props.maskProps && (
                    <Icon
                        view={IconMockView}
                        name="mockIcon"
                        className={bem.element('icon-clear')}
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
