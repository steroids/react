import * as React from 'react';
import {createPortal} from 'react-dom';
import { useComponents } from 'src/hooks';

interface ITooltipPortalProps {
    children: React.ReactNode,
}

export default function TooltipPortal(props: ITooltipPortalProps): React.ReactPortal {
    const components = useComponents();

    React.useEffect(() => {
        if (!components.ui.getPortalElement()) {
            throw new Error('Not found UI Portal container. Please set <Portal/> in layout.');
        }
    }, [components]);

    // @ts-ignore
    return createPortal(props.children, components.ui.getPortalElement());
}
