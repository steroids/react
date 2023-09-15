import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';

import calculateComponentAbsolutePosition from '../utils/calculateComponentAbsolutePosition';

interface IStyleObj {
    left: 'unset' | number,
    right: 'unset' | number,
    top: 'unset' | number,
}

export const enum Positions {
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
export type Position = (typeof Positions)[keyof typeof Positions] | string;

export interface IAbsolutePositioningInputProps {
    /**
     * @deprecated
     * Включает "умное" позиционирование - если компонент не может быть помещен в промежуток между целевым компонентом
     * и краем viewport, тогда он будет показан в противоположном направлении от заданного в свойстве position.
     */
    autoPositioning?: boolean

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
    position: Position,

    /**
     * Отобразить или скрыть компонент.
     * Включает "ручной режим", при котором можно задать логику отображения компонента извне,
     * через измененение данного свойства.
     */
    visible?: boolean,

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
    style: IStyleObj,
}

export default function useAbsolutePositioning(props: IAbsolutePositioningInputProps) {
    const [isComponentExist, setIsComponentExist] = useState(props.visible);
    const [isComponentVisible, setIsComponentVisible] = useState(props.visible);
    const [position, setPosition] = useState<string>(props.position);
    const [style, setStyle] = useState<IStyleObj>({
        left: null,
        right: null,
        top: null,
    });

    const timerRef = useRef(null);

    const calculateAbsolutePosition = useCallback((newPosition: Position, parentRef, componentSize) => {
        const {style: newStyle, position: calculatedPosition} = calculateComponentAbsolutePosition(props.gap, newPosition, parentRef, componentSize);

        setStyle(newStyle);
        setPosition(calculatedPosition);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.gap]);

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
        calculateAbsolutePosition,
        onShow,
        onHide,
    };
}
