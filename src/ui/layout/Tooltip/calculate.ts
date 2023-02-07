import {TooltipArrowPosition, TooltipStylePosition} from '../Tooltip/Tooltip';

export default function calculate(gap, position, parentRef, tooltipSize, arrowSize) {
    const style: TooltipStylePosition = { left: null, right: null, top: null };
    let arrowPosition: TooltipArrowPosition = null;

    const {top, right, left, width, height} = parentRef.getBoundingClientRect();
    const parentDimensions = {top, right, left, width, height};
    parentDimensions.top += window.scrollY;

    // eslint-disable-next-line default-case
    switch (position) {
        case 'top':
        case 'topLeft':
        case 'topRight':
            // Проверка - выходит ли tooltip за верхний край страницы?
            // Если да - меняем позицию на bottom
            if ((parentDimensions.top - window.scrollY) <= Math.round(tooltipSize.height + gap)) {
                style.top = parentDimensions.top + parentDimensions.height;
                position = position.replace('top', 'bottom');
            } else {
                style.top = parentDimensions.top - tooltipSize.height;
            }
            break;

        case 'bottom':
        case 'bottomLeft':
        case 'bottomRight':
            /// Проверка - выходит ли tooltip за нижний край страницы?
            // Если да - меняем позицию на top
            if ((window.innerHeight - (parentDimensions.top + parentDimensions.height - window.scrollY))
                <= Math.round(tooltipSize.height + gap)
            ) {
                style.top = parentDimensions.top - tooltipSize.height;
                position = position.replace('bottom', 'top');
            } else {
                style.top = parentDimensions.top + parentDimensions.height;
            }
            break;

        case 'left':
        case 'leftTop':
        case 'leftBottom':
            // Проверка - выходит ли tooltip за левый край страницы?
            // Если да - меняем позицию на right
            if (parentDimensions.left <= Math.round(tooltipSize.width + gap)) {
                style.left = parentDimensions.right;
                position = position.replace('left', 'right');
            } else {
                style.left = parentDimensions.left - tooltipSize.width;
            }

            break;

        case 'right':
        case 'rightTop':
        case 'rightBottom':
            // Проверка - выходит ли tooltip за правый край страницы?
            // Если да - меняем позицию на left
            if (document.body.clientWidth - parentDimensions.right <= Math.round(tooltipSize.width + gap)) {
                style.left = parentDimensions.left - tooltipSize.width;
                position = position.replace('right', 'left');
            } else {
                style.left = parentDimensions.right;
            }
            break;
    }

    // eslint-disable-next-line default-case
    switch (position) {
        case 'top':
        case 'bottom':
            // Выравнивание по середине
            style.left = (parentDimensions.left + (parentDimensions.width / 2)) - (tooltipSize.width / 2);
            break;

        case 'topLeft':
        case 'bottomLeft':
            // Ширина tooltip больше родителя - стрелка на середину родителя
            style.left = parentDimensions.left;
            if (parentDimensions.width < tooltipSize.width) {
                arrowPosition = {left: parentDimensions.width / 2};
            }
            break;

        case 'topRight':
        case 'bottomRight':
            // Ширина tooltip больше родителя - стрелка на середину родителя
            style.right = document.body.clientWidth - parentDimensions.right;
            if (parentDimensions.width < tooltipSize.width) {
                arrowPosition = {
                    left: null,
                    right: (parentDimensions.width / 2) - (arrowSize.width / 2),
                };
            }
            break;

        case 'left':
        case 'right':
            style.top = (parentDimensions.top + (parentDimensions.height / 2)) - (tooltipSize.height / 2);
            break;

        case 'leftTop':
        case 'rightTop':
            style.top = parentDimensions.top;
            if (parentDimensions.height < (tooltipSize.height)) {
                arrowPosition = {top: parentDimensions.height / 2};
            }
            break;

        case 'leftBottom':
        case 'rightBottom':
            style.top = parentDimensions.top + parentDimensions.height - tooltipSize.height;
            if (parentDimensions.height < tooltipSize.height) {
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
                (tooltipSize.width - parentDimensions.width) + gap,
            ))
        ) {
            style.right = null;
            position = position.replace('Right', 'Left');
            // Если ширина tooltip больше ширины родителя - выставить стрелку на середину родителя
            if (parentDimensions.left < tooltipSize.width) {
                arrowPosition = {left: parentDimensions.width / 2};
            }
            style.left = parentDimensions.left;
        }

        if (!position.includes('Right')
            && (document.body.clientWidth - parentDimensions.right
                <= Math.round((tooltipSize.width - parentDimensions.width) + gap))
        ) {
            position = position.replace('Left', 'Right');
            if (parentDimensions.width < tooltipSize.width) {
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
            && parentDimensions.top - window.scrollY <= Math.round((tooltipSize.height - parentDimensions.height) + gap)
        ) {
            position = position.replace('Bottom', 'Top');
            if (parentDimensions.height < tooltipSize.height) {
                arrowPosition = {top: parentDimensions.height / 2};
            }
            style.top = parentDimensions.top;
        }

        if (!position.includes('Bottom')
            && (window.innerHeight - (parentDimensions.top + parentDimensions.height - window.scrollY)
                <= Math.round((tooltipSize.height - parentDimensions.height) + gap)
            )
        ) {
            position = position.replace('Top', 'Bottom');
            if (parentDimensions.height < tooltipSize.height) {
                arrowPosition = {
                    bottom: (parentDimensions.height / 2) - (arrowSize.height / 2),
                };
            }
            style.top = parentDimensions.top + parentDimensions.height - tooltipSize.height;
        }
    }

    return {style, position, arrowPosition};
}
