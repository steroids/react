import * as React from 'react';
import {useCallback, useRef} from 'react';
import {useClickAway} from 'react-use';
import {useComponents} from '../../../hooks';
import TooltipInnerPortal from '../../layout/Tooltip/TooltipPortalInner';
import useAbsolutePositioning, {
    IAbsolutePositioningInputProps,
    IAbsolutePositioningOutputProps,
} from '../../../hooks/useAbsolutePositioning';

export interface IDropDownProps extends IAbsolutePositioningInputProps {
    /**
     * Дополнительный CSS-класс
     */
    className?: CssClassName,

    /**
     * Содержимое DropDown (компонент или jsx-код)
     * @example () => Component
     */
    content?: () => React.ReactNode,

    /**
     * Переопределение view React компонента для кастомизациии отображения
     * @example MyCustomView
     */
    view?: any,
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
        if (isManualControl) {
            if (!childRef.current.contains(event.target) && props.toggleVisibility) {
                props.toggleVisibility(props.visible);
            }
        } else {
            // onHide();
        }
    });

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
                        className={props.className}
                        forwardedRef={forwardedRef}
                        content={props.content}
                        position={position}
                        style={style}
                        calculatePosition={calculatePosition}
                        isComponentVisible={isComponentVisible}
                    />
                </TooltipInnerPortal>
            )}
        </>
    );
}

DropDown.defaultProps = {
    componentDestroyDelay: 300,
    defaultVisible: false,
    gap: 15,
    position: 'bottom',
};

export default DropDown;
