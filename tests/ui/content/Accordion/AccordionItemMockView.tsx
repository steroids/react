/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import Icon from '../../../../src/ui/content/Icon/Icon';
import {useBem} from '../../../../src/hooks';
import {IAccordionCommonViewProps} from '../../../../src/ui/content/Accordion/Accordion';
import IconMockView from '../Icon/IconMockView';

export default function AccordionItemView(props: IAccordionCommonViewProps) {
    const bem = useBem('AccordionItemView');

    React.useEffect(() => {
        if (!props.toggleAccordion || !props.activeKey) return;

        props.toggleAccordion(props.activeKey - 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.activeKey]);

    const handleHeaderClick = () => {
        if (props.disabled || !props.toggleAccordion) return;

        props.toggleAccordion(props.childIndex);
    };

    return (
        <div
            className={bem(bem.block({
                disable: props.disabled,
                [`position_${props.position}`]: !!props.position,
                [`theme_${props.theme}`]: !!props.theme,
            }), props.className)}
            style={props.style}
        >
            <div
                className={bem.element('header-container')}
                onClick={handleHeaderClick}
            >
                <div className={bem.element('title-container')}>
                    <p>
                        {props.title}
                    </p>
                </div>
                <div className={bem.element('icon-wrapper')}>
                    {props.icon
                        ? (typeof props.icon === 'string' ? <Icon name={props.icon} /> : props.icon)
                        : (
                            <Icon
                                view={IconMockView}
                                className={bem.element('icon', {
                                    active: !props.disabled && props.isShowMore,
                                })}
                                name="close"
                            />
                        )}
                </div>
            </div>
            <div className={bem.element('content', {visible: !props.disabled && props.isShowMore})}>
                {props.children}
            </div>
        </div>
    );
}
