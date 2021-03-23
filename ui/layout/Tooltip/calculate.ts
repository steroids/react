import {TooltipArrowPosition, TooltipStylePosition} from '@steroidsjs/core/ui/layout/Tooltip/Tooltip';

export default function calculate(gap, position, parentRect, tooltipSize, arrowSize) {
    const style: TooltipStylePosition = { left: null, right: null, top: null };
    let arrowPosition: TooltipArrowPosition = null;

    parentRect.top += window.scrollY;

    // eslint-disable-next-line default-case
    switch (position) {
        case 'top':
        case 'topLeft':
        case 'topRight':
            // Проверка - выходит ли tooltip за верхний край страницы?
            // Если да - меняем позицию на bottom
            if ((parentRect.top - window.scrollY) <= Math.round(tooltipSize.height + gap)) {
                style.top = parentRect.top + parentRect.height;
                position = position.replace('top', 'bottom');
            } else {
                style.top = parentRect.top - tooltipSize.height;
            }
            break;

        case 'bottom':
        case 'bottomLeft':
        case 'bottomRight':
            /// Проверка - выходит ли tooltip за нижний край страницы?
            // Если да - меняем позицию на top
            if ((window.innerHeight - (parentRect.top + parentRect.height - window.scrollY))
                <= Math.round(tooltipSize.height + gap)
            ) {
                style.top = parentRect.top - tooltipSize.height;
                position = position.replace('bottom', 'top');
            } else {
                style.top = parentRect.top + parentRect.height;
            }
            break;

        case 'left':
        case 'leftTop':
        case 'leftBottom':
            // Проверка - выходит ли tooltip за левый край страницы?
            // Если да - меняем позицию на right
            if (parentRect.left <= Math.round(tooltipSize.width + gap)) {
                style.left = parentRect.right;
                position = position.replace('left', 'right');
            } else {
                style.left = parentRect.left - tooltipSize.width;
            }

            break;

        case 'right':
        case 'rightTop':
        case 'rightBottom':
            // Проверка - выходит ли tooltip за правый край страницы?
            // Если да - меняем позицию на left
            if (document.body.clientWidth - parentRect.right <= Math.round(tooltipSize.width + gap)) {
                style.left = parentRect.left - tooltipSize.width;
                position = position.replace('right', 'left');
            } else {
                style.left = parentRect.right;
            }
            break;
    }

    // eslint-disable-next-line default-case
    switch (position) {
        case 'top':
        case 'bottom':
            // Выравнивание по середине
            style.left = (parentRect.left + (parentRect.width / 2)) - (tooltipSize.width / 2);
            break;

        case 'topLeft':
        case 'bottomLeft':
            // Ширина tooltip больше родителя - стрелка на середину родителя
            style.left = parentRect.left;
            if (parentRect.width < tooltipSize.width) {
                arrowPosition = {left: parentRect.width / 2};
            }
            break;

        case 'topRight':
        case 'bottomRight':
            // Ширина tooltip больше родителя - стрелка на середину родителя
            style.right = document.body.clientWidth - parentRect.right;
            if (parentRect.width < tooltipSize.width) {
                arrowPosition = {
                    left: null,
                    right: (parentRect.width / 2) - (arrowSize.width / 2),
                };
            }
            break;

        case 'left':
        case 'right':
            style.top = (parentRect.top + (parentRect.height / 2)) - (tooltipSize.height / 2);
            break;

        case 'leftTop':
        case 'rightTop':
            style.top = parentRect.top;
            if (parentRect.height < (tooltipSize.height)) {
                arrowPosition = {top: parentRect.height / 2};
            }
            break;

        case 'leftBottom':
        case 'rightBottom':
            style.top = parentRect.top + parentRect.height - tooltipSize.height;
            if (parentRect.height < tooltipSize.height) {
                arrowPosition = {
                    bottom: (parentRect.height / 2) - (arrowSize.height / 2),
                };
            }
            break;
    }

    // Проверка - при позиционировании top/bottom tooltip не выходит за пределы страницы по горизонтали
    if (position.includes('top') || position.includes('bottom')) {
        if (!position.includes('Left')
            && (style.left < 0 || parentRect.left <= Math.round((tooltipSize.width - parentRect.width) + gap))
        ) {
            style.right = null;
            position = position.replace('Right', 'Left');
            // Если ширина tooltip больше ширины родителя - выставить стрелку на середину родителя
            if (parentRect.left < tooltipSize.width) {
                arrowPosition = {left: parentRect.width / 2};
            }
            style.left = parentRect.left;
        }

        if (!position.includes('Right')
            && (document.body.clientWidth - parentRect.right
                <= Math.round((tooltipSize.width - parentRect.width) + gap))
        ) {
            position = position.replace('Left', 'Right');
            if (parentRect.width < tooltipSize.width) {
                arrowPosition = {
                    left: null,
                    right: (parentRect.width / 2) - (arrowSize.width / 2),
                };
            }
            style.left = null;
            style.right = document.body.clientWidth - parentRect.right;
        }
    }

    // Проверка - при позиционировании left/right tooltip не выходит за пределы страницы по вертикали
    if (position.includes('left') || position.includes('right')) {
        if (!position.includes('Top')
            && parentRect.top - window.scrollY <= Math.round((tooltipSize.height - parentRect.height) + gap)
        ) {
            position = position.replace('Bottom', 'Top');
            if (parentRect.height < tooltipSize.height) {
                arrowPosition = {top: parentRect.height / 2};
            }
            style.top = parentRect.top;
        }

        if (!position.includes('Bottom')
            && (window.innerHeight - (parentRect.top + parentRect.height - window.scrollY)
                <= Math.round((tooltipSize.height - parentRect.height) + gap)
            )
        ) {
            position = position.replace('Top', 'Bottom');
            if (parentRect.height < tooltipSize.height) {
                arrowPosition = {
                    bottom: (parentRect.height / 2) - (arrowSize.height / 2),
                };
            }
            style.top = parentRect.top + parentRect.height - tooltipSize.height;
        }
    }

    return {style, position, arrowPosition};
}
