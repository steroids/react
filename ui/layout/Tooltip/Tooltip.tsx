import * as React from 'react';
import TooltipInnerPortal from './TooltipPortalInner';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';


/**
 * Варианты позиций всплывающей подсказки
 * @example 'top'
 */
type TooltipPosition = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight' |
    'left' | 'leftTop' | 'leftBottom' | 'right' | 'rightTop' | 'rightBottom' | string;

interface TooltipArrowPosition {
    left?: number | string,
    right?: number | string,
    top?: number | string,
    bottom?: number | string,
}

interface TooltipStylePosition {
    left: 'unset' | number,
    right: 'unset' | number,
    top: 'unset' | number,
}

export interface ITooltipProps {
    /**
     * Текст подсказки
     * @example 'Это всплывающая подсказка.'
     */
    content?: string | any,

    /**
     * Позиционирование подсказки, относительно целевого элемента
     */
    position?: TooltipPosition,

    /**
     * Показывать ли подсказку сразу после рендера страницы
     * @example true
     */
    defaultVisible?: boolean,

    /**
     * Стили для абсолютного позиционирования подсказки
     */
    style?: TooltipStylePosition,

    /**
     * Стили для позиционирования стрелки
     * @example {left: 10}
     */
    arrowPosition?: TooltipArrowPosition,

    /**
     * Рассчет позиции подсказки
     */
    calculatePosition?: (tooltipDimensions: object, arrowDimensions: object) => void,

    [key: string]: any,
}

export interface ITooltipViewProps extends ITooltipProps {
    isTooltipVisible: boolean,
    content: string | any,
    position: TooltipPosition,
    style: TooltipStylePosition,
}

interface ITooltipState {
    isComponentExist: boolean,
    isTooltipVisible: boolean,
    style: TooltipStylePosition,
    arrowPosition: TooltipArrowPosition;
}

@components('ui')
export default class Tooltip extends React.PureComponent<ITooltipProps & IComponentsHocOutput, ITooltipState> {

    /*
    * @Todo + check all calculations + describe
    *       + 12 positions
    *       - custom styles / classes
    *       - defaultVisible -> logic
    *       - check window resize
    *       - check for more properties
    *       - fix arrow position (right, bottom) NOT centered
    *       - refactor code
    * */

    static defaultProps = {
        content: '',
        position: 'top',
        defaultVisible: false,
    };

    _timer: any;        // Таймер для плавной анимации показа/скрытия подсказки
    _gap: number;       // Расстояние между подсказкой и целевым элементом
    _position: string;  // Позиционирование подсказки, относительно целевого элемента
    _childRef: React.RefObject<any>; // Ссылка на целевой элемент

    constructor(props) {
        super(props);
        this.state = {
            isComponentExist: false,
            isTooltipVisible: this.props.defaultVisible,
            style: {
                left: null,
                right: null,
                top: null,
            },
            arrowPosition: {
                left: null,
                right: null,
                top: null,
                bottom: null,
            }
        };
        this.onShowTooltip = this.onShowTooltip.bind(this);
        this.onHideTooltip = this.onHideTooltip.bind(this);
        this.calculatePosition = this.calculatePosition.bind(this);

        this._timer = null;
        this._gap = 16;
        this._position = this.props.position;
        this._childRef = React.createRef();
    }

    componentDidMount() {
        if (this.state.isTooltipVisible) {
            this.onShowTooltip();
        }
    }

    onShowTooltip() {
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this.setState({
            isComponentExist: true,
            isTooltipVisible: false,
        }, () => {
            this.setState({
                isComponentExist: true,
                isTooltipVisible: true,
            });
        });
    }

    onHideTooltip() {
        this.setState({isTooltipVisible: false});
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this._timer = setTimeout(() => {
            this.setState({isComponentExist: false});
        }, 300);
    }

    // Основная функция расчета позиции
    calculatePosition(tooltipDimension, arrowDimensions) {
        let style =  { left: null, right: null, top: null };

        const {top, right, left, width, height} = this._childRef.current.getBoundingClientRect();
        let parentDimensions = {top, right, left, width, height};
        parentDimensions.top += window.scrollY;

        switch (this._position) {
            case 'top': {
                style.top = this.setVerticalPositionTop(parentDimensions.top, parentDimensions.height, tooltipDimension.height);
                // Выравнивание по середине
                style.left = (parentDimensions.left + (parentDimensions.width / 2)) - (tooltipDimension.width / 2);
                break;
            }

            case 'topLeft': {
                style.top = this.setVerticalPositionTop(parentDimensions.top, parentDimensions.height, tooltipDimension.height);
                style.left = parentDimensions.left;
                // Ширина tooltip больше родителя - стрелка на середину родителя
                if (parentDimensions.width < tooltipDimension.width) {
                    this.optimizeArrowInVerticalLeft(parentDimensions.width);
                }
                break;
            }

            case 'topRight': {
                style.top = this.setVerticalPositionTop(parentDimensions.top, parentDimensions.height, tooltipDimension.height);
                style.right = document.body.clientWidth - parentDimensions.right;
                // Ширина tooltip больше родителя - стрелка на середину родителя
                if (parentDimensions.width < tooltipDimension.width) {
                    this.optimizeArrowInVerticalRight(parentDimensions.width, arrowDimensions.width);
                }
                break;
            }

            case 'bottom': {
                style.top = this.setVerticalPositionBottom(parentDimensions.top, parentDimensions.height, tooltipDimension.height);
                style.left = (parentDimensions.left + (parentDimensions.width / 2)) - (tooltipDimension.width / 2);
                break;
            }

            case 'bottomLeft': {
                style.top = this.setVerticalPositionBottom(parentDimensions.top, parentDimensions.height, tooltipDimension.height);
                style.left = parentDimensions.left;
                if (parentDimensions.width < tooltipDimension.width) {
                    this.optimizeArrowInVerticalLeft(parentDimensions.width);
                }
                break;
            }

            case 'bottomRight': {
                style.top = this.setVerticalPositionBottom(parentDimensions.top, parentDimensions.height, tooltipDimension.height);
                style.right = document.body.clientWidth - parentDimensions.right;
                if (parentDimensions.width < tooltipDimension.width) {
                    this.optimizeArrowInVerticalRight(parentDimensions.width, arrowDimensions.width);
                }
                break;
            }

            case 'left': {
                style.left = this.setHorizontalPositionLeft(parentDimensions.left,
                    parentDimensions.right, parentDimensions.width, tooltipDimension.width);
                style.top = (parentDimensions.top + (parentDimensions.height / 2)) - (tooltipDimension.height / 2);
                break;
            }

            case 'leftTop': {
                style.left = this.setHorizontalPositionLeft(parentDimensions.left,
                    parentDimensions.right, parentDimensions.width, tooltipDimension.width);
                style.top = parentDimensions.top;
                if (parentDimensions.height < (tooltipDimension.height)) {
                    this.optimizeArrowInHorizontalTop(parentDimensions.height);
                }
                break;
            }

            case 'leftBottom': {
                style.left = this.setHorizontalPositionLeft(parentDimensions.left,
                    parentDimensions.right, parentDimensions.width, tooltipDimension.width);
                style.top = parentDimensions.top + parentDimensions.height - tooltipDimension.height;
                if (parentDimensions.height < tooltipDimension.height) {
                    this.optimizeArrowInHorizontalBottom(parentDimensions.height, arrowDimensions.height);
                }
                break;
            }

            case 'right': {
                style.left = this.setHorizontalPositionRight(parentDimensions.left,
                    parentDimensions.right, parentDimensions.width, tooltipDimension.width);
                style.top = (parentDimensions.top + (parentDimensions.height / 2)) - (tooltipDimension.height / 2);
                break;
            }

            case 'rightTop': {
                style.left = this.setHorizontalPositionRight(parentDimensions.left,
                    parentDimensions.right, parentDimensions.width, tooltipDimension.width);
                style.top = parentDimensions.top;
                if (parentDimensions.height < (tooltipDimension.height)) {
                    this.optimizeArrowInHorizontalTop(parentDimensions.height);
                }
                break;
            }

            case 'rightBottom': {
                style.left = this.setHorizontalPositionRight(parentDimensions.left,
                    parentDimensions.right, parentDimensions.width, tooltipDimension.width);
                style.top = parentDimensions.top + parentDimensions.height - tooltipDimension.height;
                if (parentDimensions.height < tooltipDimension.height) {
                    this.optimizeArrowInHorizontalBottom(parentDimensions.height, arrowDimensions.height);
                }
                break;
            }
        }

        // Проверка - при позиционировании top/bottom tooltip не выходит за пределы страницы по горизонтали
        if (this._position.includes('top') || this._position.includes('bottom')) {
            if (!this._position.includes('Left') && (style.left < 0 || parentDimensions.left <= Math.round((tooltipDimension.width - parentDimensions.width) + this._gap))) {
                style.right = null;
                style.left = this.setVerticalLeftPosition(parentDimensions.left, parentDimensions.width, tooltipDimension.width);
            }
            if (!this._position.includes('Right') && (document.body.clientWidth - parentDimensions.right <= Math.round((tooltipDimension.width - parentDimensions.width) + this._gap))) {
                style.left = null;
                style.right = this.setVerticalRightPosition(parentDimensions.right, parentDimensions.width, tooltipDimension.width, arrowDimensions.height);
            }
        }

        // Проверка - при позиционировании left/right tooltip не выходит за пределы страницы по вертикали
        if (this._position.includes('left') || this._position.includes('right')) {
            if (!this._position.includes('Top') && (parentDimensions.top - window.scrollY <= Math.round((tooltipDimension.height - parentDimensions.height) + this._gap))) {
                style.top = this.setHorizontalTopPosition(parentDimensions.top, parentDimensions.height, tooltipDimension.height);
            }
            if (!this._position.includes('Bottom') && (window.innerHeight - (parentDimensions.top + parentDimensions.height - window.scrollY) <= Math.round((tooltipDimension.height - parentDimensions.height) + this._gap))){
                style.top = this.setHorizontalBottomPosition(parentDimensions.top, parentDimensions.height, tooltipDimension.height, arrowDimensions.height);
            }
        }
        this.setState({style});
    }

    render() {
        if (!this.props.content) {
            return this.props.children;
        }
        const TooltipView = this.props.ui.getView('layout.TooltipView');
        const childrenElement: any = typeof this.props.children === 'object' ? React.Children.only(this.props.children) : undefined;
        return (
            <>
                {childrenElement && (React.cloneElement(childrenElement, {
                    ref: this._childRef,
                    onMouseOver: this.onShowTooltip,
                    onMouseOut: this.onHideTooltip,
                })) || (
                    <span
                        ref={this._childRef}
                        onMouseOver={this.onShowTooltip}
                        onMouseOut={this.onHideTooltip}
                    >
                        {this.props.children}
                    </span>
                )}
                {this.state.isComponentExist && (
                    <TooltipInnerPortal>
                        <TooltipView
                            isTooltipVisible={this.state.isTooltipVisible}
                            content={this.props.content}
                            position={this._position}
                            style={this.state.style}
                            arrowPosition={this.state.arrowPosition}
                            calculatePosition={this.calculatePosition}
                        />
                    </TooltipInnerPortal>
                )}
            </>
        );
    }

    /*
    * Функции для рассчета и оптимизиации положения Tooltip - VERTICAL
    * */

    setVerticalPositionTop = (parentTop, parentHeight, tooltipHeight): number => {
        let top: number;
        // Проверка - выходит ли tooltip за верхний край страницы?
        // Если да - меняем позицию на bottom
        if ((parentTop - window.scrollY) <= Math.round(tooltipHeight + this._gap)) {
            top = parentTop + parentHeight;
            this.updatePosition('top', 'bottom', 'byType');
        } else {
            top = parentTop - tooltipHeight;
        }
        return top;
    };

    setVerticalPositionBottom = (parentTop, parentHeight, tooltipHeight): number => {
        let top: number;
        /// Проверка - выходит ли tooltip за нижний край страницы?
        // Если да - меняем позицию на top
        if ((window.innerHeight - (parentTop + parentHeight - window.scrollY)) <= Math.round(tooltipHeight + this._gap)) {
            top = parentTop - tooltipHeight;
            this.updatePosition('bottom', 'top', 'byType')
        } else {
            top = parentTop + parentHeight;
        }
        return top;
    };

    optimizeArrowInVerticalLeft = (parentWidth) => {
        this.setState({
            arrowPosition: {left: parentWidth / 2}
        });
    };

    optimizeArrowInVerticalRight = (parentWidth, arrowWidth) => {
        this.setState({
            arrowPosition: {
                left: null,
                right: (parentWidth / 2) - (arrowWidth / 2),
            }
        });
    };

    setVerticalLeftPosition = (parentLeft, parentWidth, tooltipWidth) => {
        this.updatePosition('Right', 'Left', 'byModify');
        // Если ширина tooltip больше ширины родителя - выставить стрелку на середину родителя
        if (parentLeft < tooltipWidth) {
            this.optimizeArrowInVerticalLeft(parentWidth);
        }
        return parentLeft;
    };

    setVerticalRightPosition = (parentRight, parentWidth, tooltipWidth, arrowHeight) => {
        this.updatePosition('Left', 'Right', 'byModify');
        if (parentWidth < tooltipWidth) {
            this.optimizeArrowInVerticalRight(parentWidth, arrowHeight);
        }
        return document.body.clientWidth - parentRight;
    };

    /*
   * Функции для расчета и оптимизации положения Tooltip - HORIZONTAL
   * */

    setHorizontalPositionLeft = (parentLeft, parentRight, parentWidth, tooltipWidth): number => {
        let left: number;
        // Проверка - выходит ли tooltip за левый край страницы?
        // Если да - меняем позицию на right
        if (parentLeft <= Math.round(tooltipWidth + this._gap)) {
            left = parentRight;
            this.updatePosition('left', 'right', 'byType');
        } else {
            left = parentLeft - tooltipWidth;
        }
        return left;
    };

    setHorizontalPositionRight = (parentLeft, parentRight, parentWidth, tooltipWidth): number => {
        let left: number;
        // Проверка - выходит ли tooltip за правый край страницы?
        // Если да - меняем позицию на left
        if (document.body.clientWidth - parentRight <= Math.round(tooltipWidth + this._gap)) {
            left = parentLeft - tooltipWidth;
            this.updatePosition('right', 'left', 'byType');
        } else {
            left = parentRight;
        }
        return left;
    };

    optimizeArrowInHorizontalTop = (parentHeight) => {
        this.setState({
            arrowPosition: {top: parentHeight / 2}
        });
    };

    optimizeArrowInHorizontalBottom = (parentHeight, arrowHeight) => {
        this.setState({
            arrowPosition: {
                bottom: (parentHeight / 2) - (arrowHeight / 2)
            }
        });
    };

    setHorizontalTopPosition = (parentTop, parentHeight, tooltipHeight) => {
        this.updatePosition('Bottom', 'Top', 'byModify');
        if (parentHeight < tooltipHeight) {
            this.optimizeArrowInHorizontalTop(parentHeight);
        }
        return parentTop;
    };

    setHorizontalBottomPosition = (parentTop, parentHeight, tooltipHeight, arrowHeight) => {
        this.updatePosition('Top', 'Bottom', 'byModify');
        if (parentHeight < tooltipHeight) {
            this.optimizeArrowInHorizontalBottom(parentHeight, arrowHeight);
        }
        return parentTop + parentHeight - tooltipHeight;
    };


    /*
    * Функция смены позиции
    *
    * */

    updatePosition = (substr: string, newSubstr: string, sliceType: 'byType' | 'byModify' ) => {
        // Меняем основную позицию (top|left|right|bottom)
        if (sliceType === 'byType') {
            let index = this._position.indexOf(substr);
            if (index >= 0) {
                this._position = newSubstr + this._position.slice(substr.length);
            } else {
                this._position = newSubstr;
            }
            return;
        }
        // Меняем дополнительную позицию
        if (sliceType === 'byModify') {
            let index = this._position.indexOf(substr);
            if (index > 0) {
                this._position = this._position.slice(0, index) + newSubstr;
            } else {
                this._position = this._position + newSubstr;
            }
            return;
        }
    };
}
