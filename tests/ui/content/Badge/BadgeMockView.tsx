import React from 'react';
import {useBem} from '../../../../src/hooks';
import {IBadgeViewProps} from '../../../../src/ui/content/Badge/Badge';
import Icon from '../../../../src/ui/content/Icon/Icon';
import IconMockView from '../Icon/IconMockView';

interface IBadgeMockProps extends IBadgeViewProps {
    testId: string,
}

export default function BadgeView(props: IBadgeMockProps) {
    const bem = useBem('BadgeView');

    const renderCorrectIcon = () => {
        const getIconProps = () => ({
            className: 'close',
            name: require('@steroidsjs/boostrap/icons/svgs/close.svg'),
            onClick: props.onClose,
            view: IconMockView,
        });

        return ['warning', 'info'].includes(props.type) ? <Icon {...getIconProps()} /> : <Icon {...getIconProps()} />;
    };

    return (
        props.isExist && (
            <div
                data-testid={props.testId}
                className={bem(
                    bem.block({
                        [props.type]: !!props.type,
                        [props.size]: !!props.size,
                        [props.roundingStyle]: !!props.roundingStyle,
                        'has-counter': !!props.counter,
                    }),
                    props.className,
                )}
                style={props.style}
            >
                <div className={bem.element('content-wrapper')}>
                    <div className={bem.element('content')}>
                        <span className={bem.element('message')}>
                            {props.message}
                        </span>
                        {props.showClose && renderCorrectIcon()}
                        {!props.showClose && props.counter
                            && (
                                <span className={bem.element('counter')}>
                                    {typeof props.counter === 'object'
                                        && <span className={bem.element('counter-content')}>{props.counter.content}</span>}
                                </span>
                            )}
                    </div>

                </div>
            </div>
        )
    );
}
