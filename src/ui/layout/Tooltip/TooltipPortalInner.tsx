import * as React from 'react';
import {createPortal} from 'react-dom';
import { useComponents } from 'src/hooks';

export default function TooltipPortal(props) {
    const components = useComponents();

    React.useEffect(() => {
        if (!components.ui.getPortalElement()) {
            throw new Error('Not found UI Portal container. Please set <Portal/> in layout.');
        }
    }, [components]);

    return createPortal(props.children, components.ui.getPortalElement());
}
