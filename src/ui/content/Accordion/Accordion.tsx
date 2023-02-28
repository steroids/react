import * as React from 'react';
import {useComponents} from '../../../hooks';

export interface IAccordionIcon {
    open: React.ReactElement | string,
    close: React.ReactElement | string,
}

export interface IAccordionCommonProps {
    view?: any,
    style?: React.CSSProperties,
    children?: any,

    /**
     * Дополнительный CSS-класс
     */
    className?: CssClassName;

    /**
     * @example {true}
     */
    disabled?: boolean,

    /**
     * Пользовательская иконка svg или название иконки
     * @example {'circle'}
     */
    icon?: IAccordionIcon | React.ReactElement | string,

    /**
   * Включает режим в котором можно открыть только один аккордеон
   * @example {true}
   */
    hasOneOpenItem?: boolean,

    /**
     * Название AccordionItem
     * @example {'Подробнее'}
     */
    title?: string,

    /**
     * Тема аккордеона
     */
    theme?: 'light' | 'dark' | 'intermediate';

    /**
     * Номер активного AccordionItem, который может меняться динамический или быть статичным
     * @example
     */
    activeKey?: number,

    /**
     * Вызываемая функция при каждом изменении состояния
     * @example {() => {console.log('success')}}
     */
    onChange?: () => void,

    /**
     * Стилизация позиционирования.
     * При значении "top" верхняя часть шапки будет закруглена.
     * @example {'top'}
     */
    position?: 'bottom' | 'middle' | 'top',
}

export interface IAccordionCommonViewProps extends IAccordionCommonProps {
    toggleAccordion?: (number) => void,
    toggleCollapse?: (number) => void;
    childIndex?: number,
    isShowMore?: boolean,
}

function Accordion(props: IAccordionCommonProps) {
    const [selectedAccordions, setSelectedAccordions] = React.useState<number[]>([]);

    React.useEffect(() => {
        if (props.onChange) {
            props.onChange();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAccordions]);

    const toggleCollapse = indexSelected => {
        if (selectedAccordions.includes(indexSelected)) {
            const newState = [...selectedAccordions];
            const indexInArray = selectedAccordions.indexOf(indexSelected);
            newState.splice(indexInArray, 1);
            setSelectedAccordions(newState);
        } else {
            const newState = [...selectedAccordions];
            newState.push(indexSelected);
            setSelectedAccordions(newState);
        }
    };

    const toggleAccordion = indexSelected => {
        if (selectedAccordions.includes(indexSelected)) {
            setSelectedAccordions([]);
        } else {
            const newSelectedAccordion = [];
            newSelectedAccordion.push(indexSelected);
            setSelectedAccordions(newSelectedAccordion);
        }
    };

    const components = useComponents();
    const AccordionView = components.ui.getView(props.view || 'content.AccordionView');

    return (
        <AccordionView
            {...props}
        >
            {
                React.Children.map(props.children, (child: any, index) => React.cloneElement(child, {
                    style: props.style,
                    activeKey: props.activeKey,
                    childIndex: index,
                    toggleCollapse,
                    toggleAccordion,
                    hasOneOpenItem: props.hasOneOpenItem,
                    isShowMore: (selectedAccordions || []).includes(index),
                    icon: props.icon,
                    ...child.props,
                }))
            }
        </AccordionView>
    );
}

export default Accordion;
