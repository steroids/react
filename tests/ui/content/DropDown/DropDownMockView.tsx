import {useMemo} from 'react';
import _isFunction from 'lodash-es/isFunction';
import * as React from 'react';
import {useMount} from 'react-use';
import {IDropDownViewProps} from '../../../../src/ui/content/DropDown/DropDown';

import {useBem, useComponents} from '../../../../src/hooks';

export default function DropDownView(props: IDropDownViewProps) {
    const bem = useBem('DropDownView');
    const {ui} = useComponents();

    useMount(() => {
        props.calculatePosition(props.forwardedRef.current.getBoundingClientRect());
    });

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
                    [`position-${props.position}`]: !!props.position,
                }),
                props.className,
            )}
            style={props.style}
        >
            {content}
        </div>
    );
}
