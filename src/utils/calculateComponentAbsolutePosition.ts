/* eslint-disable implicit-arrow-linebreak */
import {IComponentArrowPosition, IComponentStylePosition, Position} from '../hooks/useAbsolutePositioning';

const isComponentBeyondTop = (parentDimensions, componentSize, gap) =>
    (parentDimensions.top - window.scrollY) <= Math.round(componentSize.height + gap);

const isComponentBeyondLeft = (parentDimensions, componentSize, gap) =>
    parentDimensions.left <= Math.round(componentSize.width + gap);

const isComponentBeyondRight = (parentDimensions, componentSize, gap) =>
    document.body.clientWidth - parentDimensions.right <= Math.round(componentSize.width + gap);

const isComponentBeyondBottom = (parentDimensions, componentSize, gap) =>
    (window.innerHeight - (parentDimensions.top + parentDimensions.height - window.scrollY)) <= Math.round(componentSize.height + gap);

export default function calculateComponentAbsolutePosition(gap, position, parentRef, componentSize, arrowSize = null, hasAutoPositioning = true) {
    if (process.env.IS_SSR) {
        return null;
    }

    const style: IComponentStylePosition = {
        left: null,
        right: null,
        top: null,
    };
    let arrowPosition: IComponentArrowPosition = null;

    const {top, right, left, width, height} = parentRef.getBoundingClientRect();
    const parentDimensions = {
        top,
        right,
        left,
        width,
        height,
    };

    parentDimensions.top += window.scrollY;

    // eslint-disable-next-line default-case
    switch (position) {
        case Position.TOP:
        case Position.TOP_LEFT:
        case Position.TOP_RIGHT:
            // Проверка - выходит ли component за верхний край страницы?
            // Если да - меняем позицию на bottom
            if (hasAutoPositioning && isComponentBeyondTop(parentDimensions, componentSize, gap)) {
                style.top = parentDimensions.top + parentDimensions.height;
                position = position.replace(Position.TOP, Position.BOTTOM);
            } else {
                style.top = parentDimensions.top - componentSize.height;
            }
            break;

        case Position.BOTTOM:
        case Position.BOTTOM_LEFT:
        case Position.BOTTOM_RIGHT:
            /// Проверка - выходит ли component за нижний край страницы?
            // Если да - меняем позицию на top
            if (hasAutoPositioning && isComponentBeyondBottom(parentDimensions, componentSize, gap)) {
                style.top = parentDimensions.top - componentSize.height;
                position = position.replace(Position.BOTTOM, Position.TOP);
            } else {
                style.top = parentDimensions.top + parentDimensions.height;
            }
            break;

        case Position.LEFT:
        case Position.LEFT_TOP:
        case Position.LEFT_BOTTOM:
            // Проверка - выходит ли component за левый край страницы?
            // Если да - меняем позицию на right
            if (hasAutoPositioning && isComponentBeyondLeft(parentDimensions, componentSize, gap)) {
                style.left = parentDimensions.right;
                position = position.replace(Position.LEFT, Position.RIGHT);
            } else {
                style.left = parentDimensions.left - componentSize.width;
            }
            break;

        case Position.RIGHT:
        case Position.RIGHT_TOP:
        case Position.RIGHT_BOTTOM:
            // Проверка - выходит ли component за правый край страницы?
            // Если да - меняем позицию на left
            if (hasAutoPositioning && isComponentBeyondRight(parentDimensions, componentSize, gap)) {
                style.left = parentDimensions.left - componentSize.width;
                position = position.replace(Position.RIGHT, Position.LEFT);
            } else {
                style.left = parentDimensions.right;
            }
            break;
    }

    // eslint-disable-next-line default-case
    switch (position) {
        case Position.LEFT:
        case Position.LEFT_TOP:
        case Position.LEFT_BOTTOM:
            // Проверка - выходит ли component после изменения позиции на left за левый край страницы?
            // Если да - меняем позицию на bottom
            if (hasAutoPositioning && isComponentBeyondLeft(parentDimensions, componentSize, gap)) {
                style.left = null;
                style.top = parentDimensions.top + parentDimensions.height;
                position = Position.BOTTOM;
            }
            break;

        case Position.RIGHT:
        case Position.RIGHT_TOP:
        case Position.RIGHT_BOTTOM:
            // Проверка - выходит ли component после изменения позиции на right за правый край страницы?
            // Если да - меняем позицию на bottom
            if (hasAutoPositioning && isComponentBeyondRight(parentDimensions, componentSize, gap)) {
                style.left = null;
                style.top = parentDimensions.top + parentDimensions.height;
                position = Position.BOTTOM;
            }
            break;
    }

    // eslint-disable-next-line default-case
    switch (position) {
        case Position.TOP:
        case Position.BOTTOM:
            // Выравнивание по середине
            style.left = (parentDimensions.left + (parentDimensions.width / 2)) - (componentSize.width / 2);
            break;

        case Position.TOP_LEFT:
        case Position.BOTTOM_LEFT:
            // Ширина component больше родителя - стрелка на середину родителя
            style.left = parentDimensions.left;
            if (arrowSize && (parentDimensions.width < componentSize.width)) {
                arrowPosition = {left: parentDimensions.width / 2};
            }
            break;

        case Position.TOP_RIGHT:
        case Position.BOTTOM_RIGHT:
            // Ширина component больше родителя - стрелка на середину родителя
            style.left = parentDimensions.right - componentSize.width;
            if (arrowSize && (parentDimensions.width < componentSize.width)) {
                arrowPosition = {
                    left: null,
                    right: (parentDimensions.width / 2) - (arrowSize.width / 2),
                };
            }
            break;

        case Position.LEFT:
        case Position.RIGHT:
            style.top = (parentDimensions.top + (parentDimensions.height / 2)) - (componentSize.height / 2);
            break;

        case Position.LEFT_TOP:
        case Position.RIGHT_TOP:
            style.top = parentDimensions.top;
            if (arrowSize && (parentDimensions.height < componentSize.height)) {
                arrowPosition = {top: parentDimensions.height / 2};
            }
            break;

        case Position.LEFT_BOTTOM:
        case Position.RIGHT_BOTTOM:
            style.top = parentDimensions.top + parentDimensions.height - componentSize.height;
            if (arrowSize && (parentDimensions.height < componentSize.height)) {
                arrowPosition = {
                    bottom: (parentDimensions.height / 2) - (arrowSize.height / 2),
                };
            }
            break;
    }

    //Проверка - при позиционировании top/bottom component не выходит за пределы страницы по горизонтали
    if (position.includes('top') || position.includes('bottom')) {
        if (!position.includes('Left')
            && (parentDimensions.left <= Math.round(
                (componentSize.width - parentDimensions.width) + gap,
            ))
        ) {
            style.right = null;
            position = position.replace('Right', 'Left');
            // Если ширина component больше ширины родителя - выставить стрелку на середину родителя
            if (parentDimensions.left < componentSize.width) {
                arrowPosition = {left: parentDimensions.width / 2};
            }
            style.left = parentDimensions.left;
        } else if (!position.includes('Right')
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

    // Проверка - при позиционировании left/right component не выходит за пределы страницы по вертикали
    if (position.includes('left') || position.includes('right')) {
        if (!position.includes('Top')
            && parentDimensions.top - window.scrollY <= Math.round((componentSize.height - parentDimensions.height) + gap)
        ) {
            position = position.replace('Bottom', 'Top');
            style.top = parentDimensions.top;
            if (arrowSize && parentDimensions.height < componentSize.height) {
                arrowPosition = {
                    top: parentDimensions.height / 2,
                };
            }
        } else if (!position.includes('Bottom')
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

    return {
        style,
        position,
        arrowPosition,
    };
}
