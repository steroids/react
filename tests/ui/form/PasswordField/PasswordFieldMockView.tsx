/* eslint-disable jsx-a11y/no-static-element-interactions */
import * as React from 'react';
import {IBemHocOutput} from '../../../../src/hoc/bem';
import {useBem} from '../../../../src/hooks';

import Icon from '../../../../src/ui/content/Icon';
import IconMockView from '../../content/Icon/IconMockView';
import {IPasswordFieldViewProps} from '../../../../src/ui/form/PasswordField/PasswordField';

export default function PasswordFieldView(props: IPasswordFieldViewProps & IBemHocOutput) {
    const bem = useBem('PasswordFieldView');

    return (
        <div
            className={bem(
                bem.block({
                    size: props.size,
                    filled: !!props.inputProps.value,
                    hasClear: props.showClear,
                    disabled: props.inputProps.disabled,
                }),
                props.className,
            )}
        >
            <div
                className={bem(
                    bem.element('container'),
                )}
            >
                <input
                    className={bem(
                        bem.element('input'),
                    )}
                    {...props.inputProps}
                />
                <span className={bem.element('controls')}>
                    {props.showClear && (
                        <Icon
                            view={IconMockView}
                            name="mockIcon"
                            className={bem.element('icon-clear')}
                            onClick={props.onClear}
                        />
                    )}
                    {props.security && (
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
                </span>
            </div>
            {props.security && (
                <div className={bem.element('security-bar', props.securityLevel)} />
            )}
        </div>
    );
}
