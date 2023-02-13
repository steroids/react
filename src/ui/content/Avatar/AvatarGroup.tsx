import React, {useMemo} from 'react';
import {useComponents} from '../../../hooks';

export interface AvatarGroupProps{
    view?: any,
    children?: CustomView[],
    style?: React.CSSProperties,
    maxCount?: number,
}

export type IAvatarGroupViewProps = AvatarGroupProps

function AvatarGroup(props: AvatarGroupProps) {
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

AvatarGroup.defaultProps = {

};

export default AvatarGroup;
