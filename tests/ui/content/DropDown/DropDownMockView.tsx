import {useEffect, useMemo, useRef} from 'react';
import _isFunction from 'lodash-es/isFunction';
import * as React from 'react';
import {IDropDownViewProps} from '../../../../src/ui/content/DropDown/DropDown';

import {useBem, useComponents} from '../../../../src/hooks';

export default function DropDownView(props: IDropDownViewProps) {
    const bem = useBem('DropDownView');
    const {ui} = useComponents();

    const arrowRef = useRef(null);

    useEffect(() => {
        props.calculatePosition(
            props.forwardedRef.current.getBoundingClientRect(),
            props.hasArrow ? arrowRef.current.getBoundingClientRect() : null,
        );
    }, [props.calculatePosition]);

    const contentProps = useMemo(() => ({
        onClose: props.onClose,
    }), [props.onClose]);

    let content;

    if (props.content) {
        content = props.content();

        if (_isFunction(content)) {
            content = ui.renderView(content, contentProps);
        }
    }

    return (
        <div
            ref={props.forwardedRef}
            className={bem(
                bem.block({
                    show: props.isComponentVisible,
                    position: props.position,
                }),
                props.className,
            )}
            style={props.style}
        >
            {props.hasArrow && (
                <div
                    ref={arrowRef}
                    className={bem.element('arrow', {position: props.position})}
                    style={props.arrowPosition}
                />
            )}
            <div className={bem.element('content')}>
                <span>{content}</span>
            </div>
        </div>
    );
}
