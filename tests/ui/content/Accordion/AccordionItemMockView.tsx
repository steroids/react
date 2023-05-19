/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import Icon from '../../../../src/ui/content/Icon/Icon';
import {useBem} from '../../../../src/hooks';
import {IAccordionItemViewProps, IAccordionIcon} from '../../../../src/ui/content/Accordion/Accordion';
import IconMockView from '../Icon/IconMockView';

export default function AccordionItemView(props: IAccordionItemViewProps) {
    const bem = useBem('AccordionItemView');

    React.useEffect(() => {
        if (!props.toggleAccordion || !props.toggleCollapse || !props.activeKey) {
            return;
        }

        if (props.hasOneOpenItem) {
            props.toggleAccordion(props.activeKey - 1);
        } else {
            props.toggleCollapse(props.activeKey - 1);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.activeKey]);

    const renderIcon = React.useCallback(() => {
        if (!props.icon) {
            return null;
        }

        const openClassName = bem.element('open-icon');
        const closeClassName = bem.element('close-icon');

        if (typeof props.icon === 'object') {
            const icons = props.icon as IAccordionIcon;

            return (
                <>
                    {typeof icons.open === 'string'
                        ? (
                            <Icon
                                view={IconMockView}
                                name={icons.open}
                                className={openClassName}
                            />
                        )
                        : (
                            <span className={openClassName}>
                                {icons.open}
                            </span>
                        )}
                    {typeof icons.close === 'string'
                        ? (
                            <Icon
                                view={IconMockView}
                                name={icons.close}
                                className={closeClassName}
                            />
                        )
                        : (
                            <span className={closeClassName}>
                                {icons.close}
                            </span>
                        )}
                </>
            );
        }

        return typeof props.icon === 'string'
            ? (
                <Icon
                    name={props.icon}
                    view={IconMockView}
                />
            )
            : (
                <span className={bem.element('custom-icon')}>
                    {props.icon}
                </span>
            );
    }, [bem, props.icon]);

    const handleHeaderClick = React.useCallback(() => {
        if (props.disabled || !props.toggleAccordion || !props.toggleCollapse) {
            return;
        }

        const {toggleAccordion, toggleCollapse, hasOneOpenItem, childIndex} = props;

        if (hasOneOpenItem) {
            toggleAccordion(childIndex);
        } else {
            toggleCollapse(childIndex);
        }
    }, [props]);

    return (
        <div
            className={bem(
                bem.block({
                    disable: props.disabled,
                    [`position_${props.position}`]: !!props.position,
                    [`theme_${props.theme}`]: !!props.theme,
                    opened: !props.disabled && props.isShowMore,
                }),
                props.className,
            )}
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
                    {props.showIcon && props.icon
                        ? renderIcon()
                        : (
                            <Icon
                                view={IconMockView}
                                className={bem.element('icon', {
                                    active: !props.disabled && props.isShowMore,
                                })}
                                name="mockIcon"
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
