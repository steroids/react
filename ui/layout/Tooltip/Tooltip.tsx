import * as React from 'react';
import TooltipInnerPortal from './TooltipPortalInner';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import {login} from '../../../actions/auth';


export interface ITooltipProps {
    /**
     * Текст подсказки
     * @example 'Это всплывающая подсказка.'
     */
    content?: string,

    /**
     * Позиционирование подсказки, относительно целевого элемента
     * @example 'top'
     */
    position?: 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight' |
        'left' | 'leftTop' | 'leftBottom' | 'right' | 'rightTop' | 'rightBottom' | string,

    /**
     * Показывать ли подсказку сразу после рендера страницы
     * @example 'top'
     */
    isTooltipVisible?: boolean,

    /**
     * Стили для абсолютного позиционирования подсказки
     */
    style?: {
        left: 'unset' | number,
        right: 'unset' | number,
        top: 'unset' | number,
        bottom: 'unset' | number,
    },

    /**
     * Стили для позиционирования стрелки
     */
    arrowPosition?: {
        left: string,
        right: string,
        top: string,
    },

    /**
     * Рассчет позиции подсказки
     */
    calculatePosition?: (tooltipDimension: object) => void // type DOMRect
}

interface ITooltipState {
    isComponentExist: boolean,
    isTooltipVisible: boolean,
    style: {
        left: 'unset' | number,
        right: 'unset' | number,
        top: 'unset' | number,
        bottom: 'unset' | number,
    },
    arrowPosition: {
        left?: string,
        right?: string,
        top?: string
    };
}

@components('ui')
export default class Tooltip extends React.PureComponent<ITooltipProps & IComponentsHocOutput, ITooltipState> {

    /*
    * @Todo - check all calculations + describe
    *       - 12 positions
    *       - refactor code
    *       - check for more properties
    * */

    static defaultProps = {
        content: 'Tooltip content...',
        position: 'top',
        isTooltipVisible: false,
    };

    _timer: any;        // Таймер для плавной анимации показа/скрытия подсказки
    _gap: number;       // Расстояние между подсказкой и целевым элементом
    _position: string; // Позиционирование подсказки, относительно целевого элемента

    _parentRef: React.RefObject<any>; // Ссылка на целевой элемент

    constructor(props) {
        super(props);
        this.state = {
            isComponentExist: false,
            isTooltipVisible: this.props.isTooltipVisible,
            style: {
                left: null,
                right: null,
                top: null,
                bottom: null,
            },
            arrowPosition: {
                left: null,
                right: null,
                top: null,
            }
        }
        this.onShowTooltip = this.onShowTooltip.bind(this);
        this.onHideTooltip = this.onHideTooltip.bind(this);
        this.calculatePosition = this.calculatePosition.bind(this);

        this._timer = null;
        this._gap = 16;
        this._position = this.props.position;
        this._parentRef = React.createRef();
    }

    componentDidMount() {
        this.props.isTooltipVisible ? this.onShowTooltip() : null;
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
        if (this.props.isTooltipVisible) {
            return null;
        }
        let check = false;
        this.setState({isTooltipVisible: check});
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this._timer = setTimeout(() => {
            this.setState({isComponentExist: check});
        }, 300);
    }


    /*
    * Функции для рассчета и оптимизиации положения Tooltip - VERTICAL
    * */

    setVerticalPositionTop = (parentTop, parentHeight, tooltipHeight): number => {
        let top = 0;
        // Проверка - выходит ли tooltip за верхний край страницы?
        // Если да - меняем позицию на bottom
        if ((parentTop - window.scrollY) <= Math.round(tooltipHeight + this._gap)) {
            top = parentTop + parentHeight;
            this.updatePosition('top', 'bottom', 'byType');
        } else {
            top = parentTop - tooltipHeight;
        }
        return top;
    }

    setVerticalPositionBottom = (parentTop, parentHeight, tooltipHeight): number => {
        let top = 0;
        /// Проверка - выходит ли tooltip за нижний край страницы?
        // Если да - меняем позицию на top
        if ((window.innerHeight - (parentTop + parentHeight - window.scrollY)) <= Math.round(tooltipHeight + this._gap)) {
            top = parentTop - tooltipHeight;
            this.updatePosition('bottom', 'top', 'byType')
        } else {
            top = parentTop + parentHeight;
        }
        return top;
    }

    optimizeArrowInVerticalLeft = (parentWidth) => {
        this.setState({
            arrowPosition: {left: `${parentWidth / 2}px`}
        });
    }

    optimizeArrowInVerticalRight = (parentWidth) => {
        this.setState({
            arrowPosition: {
                left: null,
                right: `${parentWidth / 2}px`
            }
        });
    }

    setVerticalLeftPosition = (parentLeft, parentWidth, tooltipWidth) => {
        this.updatePosition('Right', 'Left', 'byModify');

        // Если ширина tooltip больше ширины родителя - выставить стрелку на середину родителя
        if (parentLeft < tooltipWidth) {
            this.setState({ arrowPosition: {left: `${parentWidth / 2}px`} });
        }
        return parentLeft;
    }

    setVerticalRightPosition = (parentRight, parentWidth, tooltipWidth) => {
        this.updatePosition('Left', 'Right', 'byModify');
        if (parentWidth < tooltipWidth) {
            this.setState({ arrowPosition: {left: `${tooltipWidth - parentWidth / 2}px`} });
        }
        return document.body.clientWidth - parentRight;
    }

    /*
   * Функции для рассчета и оптимизиации положения Tooltip - HORIZONTAL
   * */

    setHorizontalPositionLeft = (parentLeft, parentRight, parentWidth, tooltipWidth): number => {
        let left = 0;
        // Проверка - выходит ли tooltip за левый край страницы?
        // Если да - меняем позицию на right
        if (parentLeft <= Math.round(tooltipWidth + this._gap)) {
            left = parentRight;
            this.updatePosition('left', 'right', 'byType');
        } else {
            left = parentLeft - tooltipWidth;
        }
        return left;
    }

    setHorizontalPositionRight = (parentLeft, parentRight, parentWidth, tooltipWidth): number => {
        let left = 0;
        // Проверка - выходит ли tooltip за правый край страницы?
        // Если да - меняем позицию на left
        if (window.innerWidth - parentRight <= Math.round(tooltipWidth + this._gap)) {
            left = parentLeft - tooltipWidth;
            this.updatePosition('right', 'left', 'byType');
        } else {
            left = parentRight;
        }
        return left;
    }

    setHorizontalTopPosition = (parentTop, parentHeight, tooltipHeight) => {
        this.updatePosition('Bottom', 'Top', 'byModify');
        if (parentHeight < tooltipHeight) {
            this.setState({
                arrowPosition: {
                    top: `${parentHeight / 2}px`
                }
            });
        }
        return parentTop;
    }

    setHorizontalBottomPosition = (parentTop, parentHeight, tooltipHeight) => {
        this.updatePosition('Top', 'Bottom', 'byModify');
        if (parentHeight < tooltipHeight) {
            this.setState({
                arrowPosition: {
                    top: `${tooltipHeight - parentHeight / 2}px`
                }
            });
        }
        return parentTop + parentHeight - tooltipHeight;
    }


    /*
    * Функция смены позиции
    * */

    updatePosition = (substr: string, newSubstr: string, sliceType: 'byType' | 'byModify' ) => {
        if (sliceType === 'byType') {
            let index = this._position.indexOf(substr);
            if (index >= 0) {
                this._position = newSubstr + this._position.slice(substr.length);
            } else {
                this._position = newSubstr;
            }
            return;
        }
        if (sliceType === 'byModify') {
            let index = this._position.indexOf(substr);
            if (index > 0) {
                this._position = this._position.slice(0, index) + newSubstr;
            } else {
                this._position = this._position + newSubstr;
            }
            return;
        }
    }

    // САМАЯ ВАЖНАЯ ФУНКЦИЯ ===========================
    calculatePosition(tooltipDimension) {
        const {top, right, left, width, height} = this._parentRef.current.firstChild.length == undefined ?
            this._parentRef.current.firstChild.getBoundingClientRect() : this._parentRef.current.getBoundingClientRect();

        let style = {...this.state.style};

        let parentDimensions = {top, right, left, width, height};
        parentDimensions.top += window.scrollY;
        this._position = this.props.position;

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
                    this.optimizeArrowInVerticalRight(parentDimensions.width);
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
                // Ширина tooltip больше родителя - стрелка на середину родителя
                if (parentDimensions.width < tooltipDimension.width) {
                    this.optimizeArrowInVerticalLeft(parentDimensions.width);
                }
                break;
            }

            case 'bottomRight': {
                style.top = this.setVerticalPositionBottom(parentDimensions.top, parentDimensions.height, tooltipDimension.height);
                style.right = document.body.clientWidth - parentDimensions.right;
                // Ширина tooltip больше родителя - стрелка на середину родителя
                if (parentDimensions.width < tooltipDimension.width) {
                    this.optimizeArrowInVerticalRight(parentDimensions.width);
                }
                break;
            }

            case 'left': {
                style.left = this.setHorizontalPositionLeft(parentDimensions.left,
                    parentDimensions.right, parentDimensions.width, tooltipDimension.width);
                style.top = (parentDimensions.top + (parentDimensions.height / 2)) - (tooltipDimension.height / 2)
                break;
            }

            case 'leftTop': {
                style.left = this.setHorizontalPositionLeft(parentDimensions.left,
                    parentDimensions.right, parentDimensions.width, tooltipDimension.width);
                style.top = parentDimensions.top;
                break;
            }

            case 'leftBottom': {
                style.left = this.setHorizontalPositionLeft(parentDimensions.left,
                    parentDimensions.right, parentDimensions.width, tooltipDimension.width);
                style.top = parentDimensions.top + parentDimensions.height - tooltipDimension.height;
                break;
            }

            case 'right': {
                style.left = this.setHorizontalPositionRight(parentDimensions.left,
                    parentDimensions.right, parentDimensions.width, tooltipDimension.width);
                style.top = (parentDimensions.top + (parentDimensions.height / 2)) - (tooltipDimension.height / 2);
                break;
            }
        }

        // Проверка - при позиционировании top/bottom tooltip не выходит за пределы страницы по горизонтали
        if (this._position.includes('top') || this._position.includes('bottom')) {
            if (!this._position.includes('Left') && (style.left < 0 || parentDimensions.left < Math.round((tooltipDimension.width - parentDimensions.width) + this._gap))) {
                style.right = null;
                style.left = this.setVerticalLeftPosition(parentDimensions.left, parentDimensions.width, tooltipDimension.width);
            }
            if (!this._position.includes('Right') && (window.innerWidth - parentDimensions.right < Math.round((tooltipDimension.width - parentDimensions.width) + this._gap))) {
                style.left = null;
                style.right = this.setVerticalRightPosition(parentDimensions.right, parentDimensions.width, tooltipDimension.width);
            }
        }

        // Проверка - при позиционировании left/right tooltip не выходит за пределы страницы по вертикали
        if (this._position.includes('left') || this._position.includes('right')) {
            if (!this._position.includes('Top') && (parentDimensions.top - window.scrollY <= Math.round(((tooltipDimension.height) / 2) + this._gap))) {
                style.top = this.setHorizontalTopPosition(parentDimensions.top, parentDimensions.height, tooltipDimension.height);
            }
            if (!this._position.includes('Bottom') && (parentDimensions.height < tooltipDimension.height) && (window.innerHeight - (parentDimensions.top + parentDimensions.height - window.scrollY)) <= Math.round(((tooltipDimension.height - parentDimensions.height) / 2) + this._gap)){
                style.top = this.setHorizontalBottomPosition(parentDimensions.top, parentDimensions.height, tooltipDimension.height);
            }
        }
        this.setState({style});
    }

    render() {
        const TooltipView = this.props.ui.getView('layout.TooltipView');

        return (
            <span
                style={{display: 'inline-block', cursor: 'pointer'}}
                onMouseOver={this.onShowTooltip}
                onMouseOut={this.onHideTooltip}
                ref={this._parentRef}
            >
                {this.props.children}
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
            </span>
        );
    }
}
