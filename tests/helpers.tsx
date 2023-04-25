import React from 'react';
import Portal from '../src/ui/layout/Portal';
import Form from '../src/ui/form/Form/Form';

export const getElementByClassName = (
    container: HTMLElement,
    className: string,
    elementIndex = 0,
) => container.getElementsByClassName(className)[elementIndex];

export function JSXWrapper<PropsType>(
    Component: any,
    props: PropsType,
    renderPortal = false,
    renderForm = false,
) {
    return (
        <>
            {renderForm ? (
                <Form formId='formId'>
                    <Component {...props} />
                </Form>
            ) : (
                <div>
                    <Component {...props} />
                </div>
            )}
            {renderPortal && <Portal />}
        </>
    );
}

export const getElementByTag = (
    container: HTMLElement,
    tag: string,
    elementIndex = 0,
) => container.getElementsByTagName(tag)[elementIndex];
