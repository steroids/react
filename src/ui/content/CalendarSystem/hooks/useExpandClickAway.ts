import {useState, useRef} from 'react';
import {useClickAway} from 'react-use';

const useExpandClickAway = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const triggerRef = useRef<any>(null);

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

export default useExpandClickAway;
