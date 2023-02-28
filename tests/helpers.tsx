import React from 'react';

export const getElementByClassName = (
    container: HTMLElement,
    className: string,
    elementIndex = 0,
) => container.getElementsByClassName(className)[elementIndex];

export function JSXWrapper<DefaultPropsType, AdditionalPropsType>(
    Component: any,
    defaultProps: DefaultPropsType,
    additionalProps?: AdditionalPropsType,
) {
    return (
        <div>
            <Component
                {...defaultProps}
                {...additionalProps}
            />
        </div>
    );
}
