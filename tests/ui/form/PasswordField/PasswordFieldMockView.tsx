/* eslint-disable jsx-a11y/no-static-element-interactions */
import * as React from 'react';
import {useBem} from '../../../../src/hooks';

import Icon from '../../../../src/ui/content/Icon';
import IconMockView from '../../content/Icon/IconMockView';
import {IPasswordFieldViewProps} from '../../../../src/ui/form/PasswordField/PasswordField';

export default function PasswordFieldView(props: IPasswordFieldViewProps) {
    const bem = useBem('PasswordFieldView');

    return (
        <div
            className={bem(
                bem.block({
                    size: props.size,
                    filled: !!props.input?.value,
                    disabled: props.inputProps?.disabled,
                }),
                props.className,
            )}
        >
            <div
                className={bem.element('container')}
            >
                <input
                    className={bem.element('input')}
                    {...props.inputProps}
                />
                {props.showSecurityIcon && (
                    <span
                        className={bem(bem.element('icon-eye'))}
                        onMouseDown={props.onShowPassword}
                        onMouseUp={props.onHidePassword}
                    >
                        <Icon
                            view={IconMockView}
                            name='mockIcon'
                        />
                    </span>
                )}
            </div>
            {props.showSecurityBar && (
                <div className={bem.element('security-bar', props.securityLevel)} />
            )}
        </div>
    );
}
