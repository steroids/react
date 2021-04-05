import * as React from 'react';
import calculate from '@steroidsjs/core/ui/layout/Tooltip/calculate';
import {useCallback, useRef, useState} from 'react';
import {useMount} from 'react-use';
import {useComponents} from '@steroidsjs/core/hooks';
import TooltipInnerPortal from './TooltipPortalInner';

/**
 * Варианты позиций всплывающей подсказки
 * @example 'top'
 */
type TooltipPosition = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight' |
    'left' | 'leftTop' | 'leftBottom' | 'right' | 'rightTop' | 'rightBottom' | string;

export interface TooltipArrowPosition {
    left?: number | string,
    right?: number | string,
    top?: number | string,
    bottom?: number | string,
}

export interface TooltipStylePosition {
    left: 'unset' | number,
    right: 'unset' | number,
    top: 'unset' | number,
}

export interface ITooltipProps {
    /**
     * Текст подсказки
     * @example 'Это всплывающая подсказка.'
     */
    content?: string | any,

    /**
     * Позиционирование подсказки, относительно целевого элемента
     */
    position?: TooltipPosition,

    /**
     * Показывать ли подсказку сразу после рендера страницы
     * @example true
     */
    defaultVisible?: boolean,

    /**
     * Стили для абсолютного позиционирования подсказки
     */
    style?: TooltipStylePosition,

    /**
     * Стили для позиционирования стрелки
     * @example {left: 10}
     */
    arrowPosition?: TooltipArrowPosition,

    /**
     * Рассчет позиции подсказки
     */
    calculatePosition?: (tooltipDimensions: object, arrowDimensions: object) => void,

    [key: string]: any,
}

export interface ITooltipViewProps extends ITooltipProps {
    isTooltipVisible: boolean,
    content: string | any,
    position: TooltipPosition,
    style: TooltipStylePosition,
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

function Tooltip(props: ITooltipProps) {
    const components = useComponents();

    const [isComponentExist, setIsComponentExist] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(props.defaultVisible);
    const [style, setStyle] = useState<TooltipStylePosition>({
        left: null,
        right: null,
        top: null,
    });
    const [arrowPosition, setArrowPosition] = useState<TooltipArrowPosition>({
        left: null,
        right: null,
        top: null,
        bottom: null,
    });

    const timerRef = useRef(null);
    const positionRef = useRef(props.position);
    const childRef = useRef(null);

    const onShowTooltip = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setIsComponentExist(true);
        setIsTooltipVisible(false);

        // TODO: How to wait setState callback?
        setTimeout(() => setIsTooltipVisible(true));
    }, []);

    const onHideTooltip = useCallback(() => {
        setIsTooltipVisible(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => setIsComponentExist(false), props.animationMs);
    }, [props.animationMs]);

    // Основная функция расчета позиции
    const calculatePosition = useCallback((tooltipSize, arrowSize) => {
        const result = calculate(
            props.gap,
            positionRef.current,
            childRef.current,
            tooltipSize,
            arrowSize,
        );

        positionRef.current = result.position;
        setStyle(result.style);
        if (result.arrowPosition) {
            setArrowPosition(result.arrowPosition);
        }
    }, [props.gap]);

    useMount(() => {
        if (isTooltipVisible) {
            onShowTooltip();
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
                    onMouseOver: onShowTooltip,
                    onMouseOut: onHideTooltip,
                })
                : (
                    <span
                        ref={childRef}
                        onFocus={onShowTooltip}
                        onMouseOver={onShowTooltip}
                        onBlur={onHideTooltip}
                        onMouseOut={onHideTooltip}
                    >
                        {props.children}
                    </span>
                )}
            {isComponentExist && (
                <TooltipInnerPortal>
                    <TooltipView
                        isTooltipVisible={isTooltipVisible}
                        content={props.content}
                        position={positionRef.current}
                        style={style}
                        arrowPosition={arrowPosition}
                        calculatePosition={calculatePosition}
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
