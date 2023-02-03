import React, {useRef} from 'react';
import {createPortal} from 'react-dom';
import {useMount, useUnmount} from 'react-use';
import {useComponents} from '../../hooks';

interface IPortalProps {
    children: React.ReactNode,
}

export default function Portal(props: IPortalProps): React.ReactPortal {
    const components = useComponents();
    const elementRef = useRef(null);

    if (!elementRef.current) {
        elementRef.current = document.createElement('div');
        elementRef.current.className = 'Portal';
    }

    useMount(() => {
        document.body.appendChild(elementRef.current);
        components.ui.setPortalElement(elementRef.current);
    });

    useUnmount(() => {
        if (elementRef.current) {
            components.ui.setPortalElement(null);
            document.body.removeChild(elementRef.current);
        }
    });

    if (process.env.IS_SSR) {
        return null;
    }

    // @ts-ignore
    return createPortal(props.children, elementRef.current);
}
