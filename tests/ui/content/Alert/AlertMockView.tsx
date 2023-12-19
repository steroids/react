import React from 'react';
import Icon from '../../../../src/ui/content/Icon';
import {IAlertViewProps} from '../../../../src/ui/content/Alert/Alert';
import {useBem} from '../../../../src/hooks';
import IconView from '../Icon/IconMockView';

interface IAlertProps extends IAlertViewProps {
    testId: string,
}

export default function Alert(props: IAlertProps) {
    const bem = useBem('AlertView');

    return (
        props.isExist && (
            <div
                data-testid={props.testId}
                className={bem(
                    bem.block({
                        [props.type]: !!props.type,
                        'close-animation': !props.isVisible,
                    }),
                    props.className,
                )}
                style={props.style}
            >
                <div className={bem.element('wrapper')}>
                    <div className={bem.element('content')}>
                        {props.showIcon && (
                            <Icon
                                view={IconView}
                                name={props.type}
                                className={bem.element('icon', {
                                    [props.type]: !!props.type,
                                })}
                            />
                        )}
                        <div className={bem.element('text-block')}>
                            {props.message && (
                                <div className={bem.element('message')}>
                                    {props.message}
                                </div>
                            )}
                            {props.description && (
                                <div className={bem.element('description')}>
                                    {props.description}
                                </div>
                            )}
                        </div>
                        <div>
                            {props.showClose && (
                                <Icon
                                    view={IconView}
                                    className={bem.element('icon-close', {
                                        large: !!props.description,
                                    })}
                                    name='mockIcon'
                                    onClick={props.onClose}
                                />
                            )}
                        </div>
                    </div>
                    {props.children || null}
                </div>
            </div>
        )
    );
}
