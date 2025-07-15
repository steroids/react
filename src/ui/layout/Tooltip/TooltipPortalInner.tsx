import {createPortal} from 'react-dom';
import {ReactNode, ReactPortal, useEffect} from 'react';
import {useComponents} from '../../../hooks';

interface ITooltipPortalProps {
    children: ReactNode,
}

export default function TooltipPortal(props: ITooltipPortalProps): ReactPortal {
    const components = useComponents();

    useEffect(() => {
        if (!components.ui.getPortalElement()) {
            throw new Error('Not found UI Portal container. Please set <Portal/> in layout.');
        }
    }, [components]);

    return createPortal(props.children, components.ui.getPortalElement());
}
