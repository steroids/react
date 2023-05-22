import * as React from 'react';
import {useComponents} from '../../../hooks';

export interface IAccordionIcon {
    open: React.ReactElement | string,
    close: React.ReactElement | string,
}

export interface IAccordionProps extends IUiComponent {
    /**
    * Дочерние элементы
    */
    children?: React.ReactNode,

    /**
     * @example true
     */
    disabled?: boolean,

    /**
     * Пользовательская иконка svg или название иконки или объект с иконками open и close
     * @example 'circle'
     */
    icon?: IAccordionIcon | React.ReactElement | string,

    /**
   * Включает режим в котором можно открыть только один AccordionItem
   * @example true
   */
    hasOneOpenItem?: boolean,

    /**
     * Название AccordionItem
     * @example 'Подробнее'
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
     * @example 'top'
     */
    position?: 'bottom' | 'middle' | 'top',

    /**
     * Отображать ли иконку у AccordionItem
     */
    showIcon?: boolean,
}

export interface IAccordionViewProps extends IAccordionProps {
    toggleAccordion?: (number) => void,
    toggleCollapse?: (number) => void;
    childIndex?: number,
    isShowMore?: boolean,
}

export type IAccordionItemProps = IAccordionProps;
export type IAccordionItemViewProps = IAccordionViewProps;

function Accordion(props: IAccordionProps) {
    const [selectedAccordionItems, setSelectedAccordionItems] = React.useState<number[]>([]);

    React.useEffect(() => {
        if (props.onChange) {
            props.onChange();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAccordionItems]);

    const toggleCollapse = indexSelected => {
        if (selectedAccordionItems.includes(indexSelected)) {
            const newState = [...selectedAccordionItems];
            const indexInArray = selectedAccordionItems.indexOf(indexSelected);
            newState.splice(indexInArray, 1);
            setSelectedAccordionItems(newState);
        } else {
            const newState = [...selectedAccordionItems];
            newState.push(indexSelected);
            setSelectedAccordionItems(newState);
        }
    };

    const toggleAccordion = indexSelected => {
        if (selectedAccordionItems.includes(indexSelected)) {
            setSelectedAccordionItems([]);
        } else {
            const newSelectedAccordion = [];
            newSelectedAccordion.push(indexSelected);
            setSelectedAccordionItems(newSelectedAccordion);
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
                    isShowMore: (selectedAccordionItems || []).includes(index),
                    icon: props.icon,
                    showIcon: props.showIcon,
                    ...child.props,
                }))
            }
        </AccordionView>
    );
}

export default Accordion;
