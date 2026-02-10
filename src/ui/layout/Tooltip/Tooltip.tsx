import * as React from 'react';
import {useCallback, useRef} from 'react';
import {useMount} from 'react-use';

import {useComponents} from '../../../hooks';
import useAbsolutePositioning, {PositionType} from '../../../hooks/useAbsolutePositioning';

import TooltipInnerPortal from './TooltipPortalInner';

export interface ITooltipArrowPosition {
    /**
    * Позиция стрелки слева
    */
    left?: number | string,

    /**
    * Позиция стрелки справа
    */
    right?: number | string,

    /**
    * Позиция стрелки сверху
    */
    top?: number | string,

    /**
    * Позиция стрелки снизу
    */
    bottom?: number | string,
}

export interface ITooltipStylePosition {
    /**
    * Позиция Tooltip слева
    */
    left: 'unset' | number,

    /**
    * Позиция Tooltip справа
    */
    right: 'unset' | number,

    /**
    * Позиция Tooltip сверху
    */
    top: 'unset' | number,
}

/**
 * Tooltip
 *
 * Компонент Tooltip предоставляет всплывающую подсказку для дочерних элементов.
 * Внутри компонента, то есть между тегами Tooltip можно использовать только html теги, например div, span и тд
 **/
export interface ITooltipProps {
    /**
     * Текст подсказки
     * @example 'Это всплывающая подсказка.'
     */
    content?: string,

    /**
     * Вложенные элементы
     */
    children?: string | any,

    /**
     * Позиционирование подсказки, относительно целевого элемента
     */
    position?: PositionType,

    /**
     * Показывать ли подсказку сразу после рендера страницы
     * @example true
     */
    defaultVisible?: boolean,

    /**
     * Время анимации в миллисекундах
     * @example 200
     */
    animationMs?: number,

    /**
     * Отступ от элемента
     * @example 16
     */
    gap?: number,

    /**
     * Стили для абсолютного позиционирования подсказки
     */
    style?: ITooltipStylePosition,

    /**
     * Стили для позиционирования стрелки
     * @example
     * {
     *  left: 10
     * }
     */
    arrowPosition?: ITooltipArrowPosition,

    /**
     * Рассчет позиции подсказки
     */
    calculatePosition?: (tooltipDimensions: Record<string, any>, arrowDimensions: Record<string, any>) => void,

    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName,

    /**
     * Пропсы для отображения элемента
     */
    viewProps?: CustomViewProps,

    [key: string]: any,
}

export interface ITooltipViewProps extends ITooltipProps {
    isTooltipVisible: boolean,
    content: string,
    position: PositionType,
    style: ITooltipStylePosition,
    className?: CssClassName,
}

/*
* @Todo + check all calculations + describe
*       + 12 positions
*       - custom styles / classes
*       - defaultVisible -> logic
*       - check window resize
*       - check for more properties
*       - fix arrow position (right, bottom) NOT centered
*       - refactor code
* */

function Tooltip(props: ITooltipProps): JSX.Element {
    const components = useComponents();
    const {
        isComponentExist,
        isComponentVisible,
        calculateAbsolutePosition,
        onShow,
        onHide,
        position,
        arrowPosition,
        style,
    } = useAbsolutePositioning({
        componentDestroyDelay: props.animationMs,
        position: props.position,
        children: props.children,
        gap: props.gap,
        defaultVisible: props.defaultVisible,
    });

    const childRef = useRef(null);

    const calculatePosition = useCallback((tooltipSize, arrowSize) => {
        calculateAbsolutePosition(position, childRef.current, tooltipSize, arrowSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useMount(() => {
        if (isComponentVisible) {
            onShow();
        }
    });

    if (!props.content) {
        return props.children;
    }

    const TooltipView = components.ui.getView('layout.TooltipView');
    const childrenElement: any = typeof props.children === 'object'
        ? React.Children.only(props.children)
        : undefined;

    return (
        <>
            {childrenElement
                ? React.cloneElement(childrenElement, {
                    ref: childRef,
                    onMouseOver: onShow,
                    onMouseOut: onHide,
                })
                : (
                    <span
                        ref={childRef}
                        onFocus={onShow}
                        onMouseOver={onShow}
                        onBlur={onHide}
                        onMouseOut={onHide}
                    >
                        {props.children}
                    </span>
                )}
            {isComponentExist && (
                <TooltipInnerPortal>
                    <TooltipView
                        isTooltipVisible={isComponentVisible}
                        content={props.content}
                        position={position}
                        style={style}
                        arrowPosition={arrowPosition}
                        calculatePosition={calculatePosition}
                        className={props.className}
                        viewProps={props.viewProps}
                    />
                </TooltipInnerPortal>
            )}
        </>
    );
}

Tooltip.defaultProps = {
    content: '',
    position: 'top',
    defaultVisible: false,
    gap: 16,
    animationMs: 300,
};

export default Tooltip;
