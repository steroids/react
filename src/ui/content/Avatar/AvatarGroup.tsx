import {ReactNode, useMemo} from 'react';

import {useComponents} from '../../../hooks';

export interface AvatarGroupProps{
    view?: CustomView,
    children?: ReactNode[],
    style?: CustomStyle,
    maxCount?: number,
}

export type IAvatarGroupViewProps = AvatarGroupProps

const defaultProps: AvatarGroupProps = {

};

export default function AvatarGroup(receivedProps: AvatarGroupProps) {
    const props = useMemo(() => ({
        ...defaultProps,
        ...receivedProps,
    }), [receivedProps]);

    const childrenToRender = useMemo(() => {
        if (props.maxCount < props.children.length) {
            return props.children.slice(0, props.maxCount);
        }
        return props.children;
    }, [props.children, props.maxCount]);

    const components = useComponents();
    const AvatarGroupView = components.ui.getView(props.view || 'content.AvatarGroupView');

    return (
        <AvatarGroupView>
            {childrenToRender}
        </AvatarGroupView>
    );
}
