import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';

interface IStyleObj {
    left: 'unset' | number,
    right: 'unset' | number,
    top: 'unset' | number,
}

/**
 * Варианты абсолютного позиционирования
 * @example 'top'
 */
type Position = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight' |
    'left' | 'leftTop' | 'leftBottom' | 'right' | 'rightTop' | 'rightBottom' | string;

export interface IAbsolutePositioningInputProps {
    /**
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

    const calculateAbsolutePosition = useCallback((newPosition:Position, childRef, componentSize) => {
        const newStyle: IStyleObj = {left: null, right: null, top: null};
        const {top, right, left, width, height} = childRef.getBoundingClientRect();
        const parentDimensions = {top, right, left, width, height};
        parentDimensions.top += window.scrollY;

        const useAutoPositioning = props.autoPositioning;

        // eslint-disable-next-line default-case
        switch (newPosition) {
            case 'top':
            case 'topLeft':
            case 'topRight':
                // Проверка - выходит ли tooltip за верхний край страницы?
                // Если да - меняем позицию на bottom
                if (
                    useAutoPositioning
                    && ((parentDimensions.top - window.scrollY) <= Math.round(componentSize.height + props.gap))
                ) {
                    newStyle.top = parentDimensions.top + parentDimensions.height;
                    newPosition = newPosition.replace('top', 'bottom');
                } else {
                    newStyle.top = parentDimensions.top - componentSize.height;
                }
                break;

            case 'bottom':
            case 'bottomLeft':
            case 'bottomRight':
                // Проверка - выходит ли tooltip за нижний край страницы?
                // Если да - меняем позицию на top
                if (
                    useAutoPositioning
                    && ((window.innerHeight - (
                        parentDimensions.top + parentDimensions.height - window.scrollY
                    ))) <= Math.round(componentSize.height + props.gap)
                ) {
                    newStyle.top = parentDimensions.top - componentSize.height;
                    newPosition = newPosition.replace('bottom', 'top');
                } else {
                    newStyle.top = parentDimensions.top + parentDimensions.height;
                }
                break;

            case 'left':
            case 'leftTop':
            case 'leftBottom':
                // Проверка - выходит ли tooltip за левый край страницы?
                // Если да - меняем позицию на right
                if (useAutoPositioning && (parentDimensions.left <= Math.round(componentSize.width + props.gap))) {
                    newStyle.left = parentDimensions.right;
                    newPosition = newPosition.replace('left', 'right');
                } else {
                    newStyle.left = parentDimensions.left - componentSize.width;
                }

                break;

            case 'right':
            case 'rightTop':
            case 'rightBottom':
                // Проверка - выходит ли tooltip за правый край страницы?
                // Если да - меняем позицию на left
                if (
                    useAutoPositioning
                    && (document.body.clientWidth - parentDimensions.right <= Math.round(
                        componentSize.width + props.gap,
                    ))
                ) {
                    newStyle.left = parentDimensions.left - componentSize.width;
                    newPosition = newPosition.replace('right', 'left');
                } else {
                    newStyle.left = parentDimensions.right;
                }
                break;
        }

        // eslint-disable-next-line default-case
        switch (newPosition) {
            case 'top':
            case 'bottom':
                // Выравнивание по середине
                newStyle.left = (parentDimensions.left + (parentDimensions.width / 2)) - (componentSize.width / 2);
                break;

            case 'topLeft':
            case 'bottomLeft':
                // Ширина tooltip больше родителя - стрелка на середину родителя
                newStyle.left = parentDimensions.left;
                break;

            case 'topRight':
            case 'bottomRight':
                // Ширина tooltip больше родителя - стрелка на середину родителя
                newStyle.right = document.body.clientWidth - parentDimensions.right;
                break;

            case 'left':
            case 'right':
                newStyle.top = (parentDimensions.top + (parentDimensions.height / 2)) - (componentSize.height / 2);
                break;

            case 'leftTop':
            case 'rightTop':
                newStyle.top = parentDimensions.top;
                break;

            case 'leftBottom':
            case 'rightBottom':
                newStyle.top = parentDimensions.top + parentDimensions.height - componentSize.height;
                break;
        }

        // Проверка - при позиционировании top/bottom tooltip не выходит за пределы страницы по горизонтали
        if (newPosition.includes('top') || newPosition.includes('bottom')) {
            if (!newPosition.includes('Left')
                && (newStyle.left < 0 || parentDimensions.left
                    <= Math.round((componentSize.width - parentDimensions.width) + props.gap))
            ) {
                newStyle.right = null;
                newPosition = newPosition.replace('Right', 'Left');
                newStyle.left = parentDimensions.left;
            }

            if (!newPosition.includes('Right')
                && (document.body.clientWidth - parentDimensions.right
                    <= Math.round((componentSize.width - parentDimensions.width) + props.gap))
            ) {
                newPosition = newPosition.replace('Left', 'Right');
                newStyle.left = null;
                newStyle.right = document.body.clientWidth - parentDimensions.right;
            }
        }

        // Проверка - при позиционировании left/right tooltip не выходит за пределы страницы по вертикали
        if (newPosition.includes('left') || newPosition.includes('right')) {
            if (!newPosition.includes('Top')
                && parentDimensions.top - window.scrollY
                <= Math.round((componentSize.height - parentDimensions.height) + props.gap)
            ) {
                newPosition = newPosition.replace('Bottom', 'Top');
                newStyle.top = parentDimensions.top;
            }

            if (!newPosition.includes('Bottom')
                && (window.innerHeight - (parentDimensions.top + parentDimensions.height - window.scrollY)
                    <= Math.round((componentSize.height - parentDimensions.height) + props.gap)
                )
            ) {
                newPosition = newPosition.replace('Top', 'Bottom');
                newStyle.top = parentDimensions.top + parentDimensions.height - componentSize.height;
            }
        }
        setStyle(newStyle);
        setPosition(newPosition);
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
