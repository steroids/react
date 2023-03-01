import React from 'react';

export const getElementByClassName = (
    container: HTMLElement,
    className: string,
    elementIndex = 0,
) => container.getElementsByClassName(className)[elementIndex];

export function JSXWrapper<PropsType>(
    Component: any,
    props: PropsType,
) {
    return (
        <div>
            <Component
                {...props}
            />
        </div>
    );
}

export const getElementByTag = (
    container: HTMLElement,
    tag: string,
    elementIndex = 0,
) => container.getElementsByTagName(tag)[elementIndex];
