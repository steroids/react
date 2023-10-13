import React from 'react';
import {useClickAway} from 'react-use';

const useExpand = () => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const triggerRef = React.useRef<any>(null);

    useClickAway(triggerRef, () => {
        if (!isExpanded) {
            return;
        }

        setIsExpanded(false);
    });

    return {
        isExpanded,
        setIsExpanded,
        triggerRef,
    };
};

export default useExpand;
