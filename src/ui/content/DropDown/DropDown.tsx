import * as React from 'react';
import {useCallback, useRef} from 'react';
import {useClickAway, useEvent} from 'react-use';
import {useComponents} from '../../../hooks';
import TooltipInnerPortal from '../../layout/Tooltip/TooltipPortalInner';
import useAbsolutePositioning, {
    IAbsolutePositioningInputProps,
    IAbsolutePositioningOutputProps,
} from '../../../hooks/useAbsolutePositioning';

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
    closeMode?: 'click-away' | 'click-any',

    /**
    * Позволяет управлять отображением указателя
    * @example true
    */
    hasArrow?: boolean,
      
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
    calculatePosition: (componentSize: ClientRect) => void,

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

    const calculatePosition = useCallback((componentSize) => {
        calculateAbsolutePosition(position, childRef.current, componentSize);
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
                // TODO Change Portal to global
                <TooltipInnerPortal>
                    <DropDownView
                        {...props}
                        className={props.className}
                        forwardedRef={forwardedRef}
                        content={props.content}
                        position={position}
                        style={style}
                        calculatePosition={calculatePosition}
                        isComponentVisible={isComponentVisible}
                        onClose={onHide}
                    />
                </TooltipInnerPortal>
            )}
        </>
    );
}

DropDown.defaultProps = {
    autoPositioning: false,
    componentDestroyDelay: 300,
    defaultVisible: false,
    gap: 15,
    position: 'bottom',
    closeMode: 'click-away',
    hasArrow: true,
};

export default DropDown;
