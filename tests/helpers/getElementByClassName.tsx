export const getElementByClassName = (
    container: HTMLElement,
    className: string,
    elementIndex = 0,
) => container.getElementsByClassName(className)[elementIndex];
