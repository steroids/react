export const getElementByTag = (
    container: HTMLElement,
    tag: string,
    elementIndex = 0,
) => container.getElementsByTagName(tag)[elementIndex];
