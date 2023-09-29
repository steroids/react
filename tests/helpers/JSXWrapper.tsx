import React from 'react';
import Portal from '../../src/ui/layout/Portal';

export function JSXWrapper<PropsType>(
    Component: any,
    props: PropsType,
    renderPortal = false,
) {
    return (
        <>
            <div>
                <Component
                    {...props}
                />
            </div>
            {renderPortal && <Portal />}
        </>
    );
}
