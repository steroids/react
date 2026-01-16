import * as React from 'react';
import {useCallback, useMemo, useRef} from 'react';
import {useClickAway, useEvent} from 'react-use';

import {useComponents} from '../../../hooks';
import useAbsolutePositioning, {
    IAbsolutePositioningInputProps,
    IAbsolutePositioningOutputProps,
} from '../../../hooks/useAbsolutePositioning';
import TooltipInnerPortal from '../../layout/Tooltip/TooltipPortalInner';

/**
 * Menu
 *
 * Компонент, представляющий меню с элементами, которые могут быть выбраны или нажаты.
 * Компонент позволяет отображать и скрывать содержимое меню, а также управлять его позиционированием.
 */
export interface IDropDownProps extends IAbsolutePositioningInputProps {
    /**
     * Содержимое DropDown (компонент или jsx-код)
     * @example () => Component
     */
    content?: () => React.ReactNode,

    /**
     * В каком случае закрывать DropDown. По-умолчанию - `click-away`
     * @example click-any
     */
    closeMode?: 'click-away' | 'click-any' | string,

    /**
    * Позволяет управлять отображением указателя
    * @example true
    */
    hasArrow?: boolean,

    /**
    * Переопределение view React компонента для кастомизациии отображения
    * @example MyCustomView
    */
    view?: CustomView,

    /**
    * Дополнительный CSS-класс
    */
    className?: CssClassName,
}

export interface IDropDownViewProps extends IDropDownProps, IAbsolutePositioningOutputProps {
    /**
     * Рассчет абсолютной позиции
     */
    calculatePosition?: (dropDownDimensions: Record<string, any>, arrowDimensions: Record<string, any>) => void,

    /**
     * Ссылка на view
     */
    forwardedRef: any,
}

function DropDown(props: IDropDownProps): JSX.Element {
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
    } = useAbsolutePositioning(props);
    const childRef = useRef(null);
    const isManualControl = props.visible !== undefined;

    // Outside click -> close
    const forwardedRef = useRef(null);
    useClickAway(forwardedRef, (event) => {
        if (props.closeMode === 'click-away') {
            if (isManualControl) {
                if (!childRef.current.contains(event.target) && props.onClose) {
                    props.onClose();
                }
            } else {
                onHide();
            }
        }
    }, ['mousedown', 'touchstart']);

    // Any click -> close
    const onAnyClick = useCallback(() => {
        if (isComponentExist && isComponentVisible && props.closeMode === 'click-any') {
            onHide();
        }
    }, [isComponentExist, isComponentVisible, onHide, props.closeMode]);
    useEvent('mousedown', onAnyClick);
    useEvent('touchstart', onAnyClick);

    const calculatePosition = useCallback((componentSize, arrowSize) => {
        calculateAbsolutePosition(position, childRef.current, componentSize, arrowSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const DropDownView = components.ui.getView(props.view || 'content.DropDownView');
    const childrenElement: any = typeof props.children === 'object'
        ? React.Children.only(props.children)
        : undefined;
    const resultProps: any = {
        ref: childRef,
    };

    if (!isManualControl) {
        resultProps.onClick = () => {
            onShow();
        };
    }

    const viewProps = useMemo(() => ({
        className: props.className,
        forwardedRef,
        content: props.content,
        position,
        style,
        arrowPosition,
        calculatePosition,
        isComponentVisible,
        onClose: onHide,
        hasArrow: props.hasArrow,
    }), [arrowPosition, calculatePosition, isComponentVisible, onHide, props.className, props.content, props.hasArrow, position, style]);

    return (
        <>
            {childrenElement
                ? React.cloneElement(childrenElement, resultProps)
                : (
                    <span>
                        {props.children}
                    </span>
                )}
            {isComponentExist && (
                <TooltipInnerPortal>
                    <DropDownView
                        {...viewProps}
                    />
                </TooltipInnerPortal>
            )}
        </>
    );
}

DropDown.defaultProps = {
    autoPositioning: true,
    componentDestroyDelay: 300,
    defaultVisible: false,
    gap: 15,
    position: 'bottom',
    closeMode: 'click-away',
    hasArrow: true,
};

export default DropDown;
