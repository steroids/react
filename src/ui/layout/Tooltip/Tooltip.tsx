import * as React from 'react';
import {useCallback, useRef, useState} from 'react';
import {useMount} from 'react-use';
import calculate from '../Tooltip/calculate';
import {useComponents} from '../../../hooks';
import TooltipInnerPortal from './TooltipPortalInner';

/**
 * Варианты позиций всплывающей подсказки
 * @example 'top'
 */
type TooltipPosition = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight' |
    'left' | 'leftTop' | 'leftBottom' | 'right' | 'rightTop' | 'rightBottom' | string;

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

export interface ITooltipProps {
    /**
     * Текст подсказки
     * @example 'Это всплывающая подсказка.'
     */
    content?: string | any,

    /**
     * Вложенные элементы
     */
    children?: string | any,

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
     * @example {left: 10}
     */
    arrowPosition?: ITooltipArrowPosition,

    /**
     * Рассчет позиции подсказки
     */
    calculatePosition?: (tooltipDimensions: Record<string, any>, arrowDimensions: Record<string, any>) => void,

    [key: string]: any,
}

export interface ITooltipViewProps extends ITooltipProps {
    isTooltipVisible: boolean,
    content: string | any,
    position: TooltipPosition,
    style: ITooltipStylePosition,
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

    const [isComponentExist, setIsComponentExist] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(props.defaultVisible);
    const [style, setStyle] = useState<ITooltipStylePosition>({
        left: null,
        right: null,
        top: null,
    });
    const [arrowPosition, setArrowPosition] = useState<ITooltipArrowPosition>({
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

        if (!result) {
            return;
        }

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
