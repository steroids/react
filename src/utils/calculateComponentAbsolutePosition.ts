import {Positions} from '../hooks/useAbsolutePositioning';

export interface IComponentStylePosition {
    /**
     * Позиция компонента слева
     */
    left: 'unset' | number,

    /**
     * Позиция компонента справа
     */
    right: 'unset' | number,

    /**
     * Позиция компонента сверху
     */
    top: 'unset' | number,
}

export interface IComponentArrowPosition {
    /**
     * Позиция стрелки слева
     */
    left?: number | string,

    /**
     * Позиция стрелки справа
     */
    right?: number | string,

    /**
     * Позиция стрелки сверху
     */
    top?: number | string,

    /**
     * Позиция стрелки снизу
     */
    bottom?: number | string,
}

export default function calculateComponentAbsolutePosition(gap, position, parentRef, componentSize, arrowSize = null) {
    if (process.env.IS_SSR) {
        return null;
    }

    const style: IComponentStylePosition = {left: null, right: null, top: null};
    let arrowPosition: IComponentArrowPosition = null;

    const {top, right, left, width, height} = parentRef.getBoundingClientRect();
    const parentDimensions = {top, right, left, width, height};

    parentDimensions.top += window.scrollY;

    // eslint-disable-next-line default-case
    switch (position) {
        case Positions.TOP:
        case Positions.TOP_LEFT:
        case Positions.TOP_RIGHT:
            // Проверка - выходит ли tooltip за верхний край страницы?
            // Если да - меняем позицию на bottom
            if ((parentDimensions.top - window.scrollY) <= Math.round(componentSize.height + gap)) {
                style.top = parentDimensions.top + parentDimensions.height;
                position = position.replace(Positions.TOP, Positions.BOTTOM);
            } else {
                style.top = parentDimensions.top - componentSize.height;
            }
            break;

        case Positions.BOTTOM:
        case Positions.BOTTOM_LEFT:
        case Positions.BOTTOM_RIGHT:
            /// Проверка - выходит ли tooltip за нижний край страницы?
            // Если да - меняем позицию на top
            if ((window.innerHeight - (parentDimensions.top + parentDimensions.height - window.scrollY))
                <= Math.round(componentSize.height + gap)
            ) {
                style.top = parentDimensions.top - componentSize.height;
                position = position.replace(Positions.BOTTOM, Positions.TOP);
            } else {
                style.top = parentDimensions.top + parentDimensions.height;
            }
            break;

        case Positions.LEFT:
        case Positions.LEFT_TOP:
        case Positions.LEFT_BOTTOM:
            // Проверка - выходит ли tooltip за левый край страницы?
            // Если да - меняем позицию на right
            if (parentDimensions.left <= Math.round(componentSize.width + gap)) {
                style.left = parentDimensions.right;
                position = position.replace(Positions.LEFT, Positions.RIGHT);
            } else {
                style.left = parentDimensions.left - componentSize.width;
            }
            break;

        case Positions.RIGHT:
        case Positions.RIGHT_TOP:
        case Positions.RIGHT_BOTTOM:
            // Проверка - выходит ли tooltip за правый край страницы?
            // Если да - меняем позицию на left
            if (document.body.clientWidth - parentDimensions.right <= Math.round(componentSize.width + gap)) {
                style.left = parentDimensions.left - componentSize.width;
                position = position.replace(Positions.RIGHT, Positions.LEFT);
            } else {
                style.left = parentDimensions.right;
            }
            break;
    }

    // eslint-disable-next-line default-case
    switch (position) {
        case Positions.TOP:
        case Positions.BOTTOM:
            // Выравнивание по середине
            style.left = (parentDimensions.left + (parentDimensions.width / 2)) - (componentSize.width / 2);
            break;

        case Positions.TOP_LEFT:
        case Positions.BOTTOM_LEFT:
            // Ширина tooltip больше родителя - стрелка на середину родителя
            style.left = parentDimensions.left;
            if (arrowSize && (parentDimensions.width < componentSize.width)) {
                arrowPosition = {left: parentDimensions.width / 2};
            }
            break;

        case Positions.TOP_RIGHT:
        case Positions.BOTTOM_RIGHT:
            // Ширина tooltip больше родителя - стрелка на середину родителя
            style.left = parentDimensions.right - componentSize.width;
            if (arrowSize && (parentDimensions.width < componentSize.width)) {
                arrowPosition = {
                    left: null,
                    right: (parentDimensions.width / 2) - (arrowSize.width / 2),
                };
            }
            break;

        case Positions.LEFT:
        case Positions.RIGHT:
            style.top = (parentDimensions.top + (parentDimensions.height / 2)) - (componentSize.height / 2);
            break;

        case Positions.LEFT_TOP:
        case Positions.RIGHT_TOP:
            style.top = parentDimensions.top;
            if (arrowSize && (parentDimensions.height < (componentSize.height))) {
                arrowPosition = {top: parentDimensions.height / 2};
            }
            break;

        case Positions.LEFT_BOTTOM:
        case Positions.RIGHT_BOTTOM:
            style.top = parentDimensions.top + parentDimensions.height - componentSize.height;
            if (arrowSize && (parentDimensions.height < componentSize.height)) {
                arrowPosition = {
                    bottom: (parentDimensions.height / 2) - (arrowSize.height / 2),
                };
            }
            break;
    }

    // Проверка - при позиционировании top/bottom tooltip не выходит за пределы страницы по горизонтали
    if (position.includes('top') || position.includes('bottom')) {
        if (!position.includes('Left')
            && (style.left < 0 || parentDimensions.left <= Math.round(
                (componentSize.width - parentDimensions.width) + gap,
            ))
        ) {
            style.right = null;
            position = position.replace('Right', 'Left');
            // Если ширина tooltip больше ширины родителя - выставить стрелку на середину родителя
            if (parentDimensions.left < componentSize.width) {
                arrowPosition = {left: parentDimensions.width / 2};
            }
            style.left = parentDimensions.left;
        }

        if (!position.includes('Right')
            && (document.body.clientWidth - parentDimensions.right
                <= Math.round((componentSize.width - parentDimensions.width) + gap))
        ) {
            position = position.replace('Left', 'Right');
            if (arrowSize && (parentDimensions.width < componentSize.width)) {
                arrowPosition = {
                    left: null,
                    right: (parentDimensions.width / 2) - (arrowSize.width / 2),
                };
            }
            style.left = null;
            style.right = document.body.clientWidth - parentDimensions.right;
        }
    }

    // Проверка - при позиционировании left/right tooltip не выходит за пределы страницы по вертикали
    if (position.includes('left') || position.includes('right')) {
        if (!position.includes('Top')
            && parentDimensions.top - window.scrollY <= Math.round((componentSize.height - parentDimensions.height) + gap)
        ) {
            position = position.replace('Bottom', 'Top');
            if (parentDimensions.height < componentSize.height) {
                arrowPosition = {top: parentDimensions.height / 2};
            }
            style.top = parentDimensions.top;
        }

        if (!position.includes('Bottom')
            && (window.innerHeight - (parentDimensions.top + parentDimensions.height - window.scrollY)
                <= Math.round((componentSize.height - parentDimensions.height) + gap)
            )
        ) {
            position = position.replace('Top', 'Bottom');
            if (arrowSize && (parentDimensions.height < componentSize.height)) {
                arrowPosition = {
                    bottom: (parentDimensions.height / 2) - (arrowSize.height / 2),
                };
            }
            style.top = parentDimensions.top + parentDimensions.height - componentSize.height;
        }
    }

    return {style, position, arrowPosition};
}
