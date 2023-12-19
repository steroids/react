import * as React from 'react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import calculateComponentAbsolutePosition from '../utils/calculateComponentAbsolutePosition';

export interface IComponentStylePosition {
    /**
     * Позиция компонента слева
     */
    left: 'unset' | number,

    /**
     * Позиция компонента справа
     */
    right: 'unset' | number,

    /**
     * Позиция компонента сверху
     */
    top: 'unset' | number,
}

export interface IComponentArrowPosition {
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

export const enum Position {
    TOP = 'top',
    TOP_LEFT = 'topLeft',
    TOP_RIGHT = 'topRight',
    BOTTOM = 'bottom',
    BOTTOM_LEFT = 'bottomLeft',
    BOTTOM_RIGHT = 'bottomRight',
    LEFT = 'left',
    LEFT_TOP = 'leftTop',
    LEFT_BOTTOM = 'leftBottom',
    RIGHT = 'right',
    RIGHT_TOP = 'rightTop',
    RIGHT_BOTTOM = 'rightBottom',
}

/**
 * Варианты абсолютного позиционирования
 * @example 'top'
 */
export type PositionType = keyof typeof Position | string;

export interface IAbsolutePositioningInputProps {
    /**
     * Включает "умное" позиционирование - если компонент не может быть помещен в промежуток между целевым компонентом
     * и краем viewport, тогда он будет показан в противоположном направлении от заданного в свойстве position.
     */
    autoPositioning?: boolean,

    /**
     * Дочерние элементы
     */
    children?: React.ReactNode,

    /**
     * Задержка перед размонтированием компонента, когда он должен быть скрыт.
     * В этот момент удобно применять различные анимации ухода.
     */
    componentDestroyDelay?: number,

    /**
     * Промежуток между компонентом и целевым элементом.
     * Используется в рассчетах позиционирования.
     */
    gap?: number,

    /**
     * Позиционирование компонента, относительно целевого элемента
     */
    position: PositionType,

    /**
     * Отобразить или скрыть компонент.
     * Включает "ручной режим", при котором можно задать логику отображения компонента извне,
     * через измененение данного свойства.
     */
    visible?: boolean,

    /**
     * Показывать ли компонент сразу после рендера страницы
     */
    defaultVisible?: boolean,

    /**
     * Обработчик изменения свойства isComponentVisible (отображение на странице).
     * Возвращает значение isComponentVisible.
     */
    onVisibleChange?: (isComponentVisible: boolean) => void,

    /**
     * Срабатывает в "ручном режиме", при клике за пределами компонента и целевого элемента.
     * Возвращает значение visible.
     */
    onClose?: () => void,
}

export interface IAbsolutePositioningOutputProps {
    /**
     * Нужно ли рендерить компонент
     */
    isComponentExist: boolean,

    /**
     * Нужно ли показывать компонент на странице
     */
    isComponentVisible: boolean,

    /**
     * Объект стилей для абсолютного позиционирования
     */
    style: IComponentStylePosition,

    /**
     * Объект стилей для позиционирования стрелки
     */
    arrowPosition?: IComponentArrowPosition,
}

const DEFAULT_AUTO_POSITIONING_VALUE = true;

export default function useAbsolutePositioning(props: IAbsolutePositioningInputProps) {
    const [isComponentExist, setIsComponentExist] = useState(props.visible);
    const [isComponentVisible, setIsComponentVisible] = useState(props.visible || props.defaultVisible);
    const [position, setPosition] = useState<string>(props.position);
    const [arrowPosition, setArrowPosition] = useState<IComponentArrowPosition>({
        left: null,
        right: null,
        top: null,
        bottom: null,
    });
    const [style, setStyle] = useState<IComponentStylePosition>({
        left: null,
        right: null,
        top: null,
    });

    const hasAutoPositioning = useMemo(() => props.autoPositioning ?? DEFAULT_AUTO_POSITIONING_VALUE, [props.autoPositioning]);

    const timerRef = useRef(null);

    const calculateAbsolutePosition = useCallback((newPosition: PositionType, parentRef, componentSize, arrowSize = null) => {
        const {
            style: newStyle,
            position: calculatedPosition,
            arrowPosition: calculatedArrowPosition,
        } = calculateComponentAbsolutePosition(props.gap, newPosition, parentRef, componentSize, arrowSize, hasAutoPositioning);

        setStyle(newStyle);
        setPosition(calculatedPosition);

        if (calculatedArrowPosition) {
            setArrowPosition(calculatedArrowPosition);
        }
    }, [hasAutoPositioning, props.gap]);

    const onShow = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setIsComponentExist(true);
        setIsComponentVisible(false);

        // TODO: How to wait setState callback?
        setTimeout(() => setIsComponentVisible(true));
    }, []);

    const onHide = useCallback(() => {
        setIsComponentVisible(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        // TODO add time value to props
        timerRef.current = setTimeout(() => setIsComponentExist(false), props.componentDestroyDelay);
    }, [props.componentDestroyDelay]);

    // Trigger on visible
    useEffect(() => {
        if (props.visible) {
            onShow();
        } else {
            onHide();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.visible]);

    // Trigger on isComponentVisible
    useEffect(() => {
        if (props.onVisibleChange) {
            props.onVisibleChange(isComponentVisible);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isComponentVisible]);

    return {
        isComponentExist,
        isComponentVisible,
        style,
        position,
        arrowPosition,
        calculateAbsolutePosition,
        onShow,
        onHide,
    };
}
