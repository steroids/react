import * as React from 'react';
import {useComponents} from '../../../hooks';

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
    icon?: React.ReactNode | string,

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
    positionStyle?: 'bottom' | 'middle' | 'top',
}

export interface IAccordionCommonViewProps extends IAccordionCommonProps {
    toggleAccordion?: (number) => void,
    childIndex?: number,
    isShowMore?: boolean,
}

function Accordion(props: IAccordionCommonProps) {
    const [selectedAccordion, setSelectedAccordion] = React.useState<number[]>([]);

    React.useEffect(() => {
        if (props.onChange) {
            props.onChange();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAccordion]);

    const toggleAccordion = indexSelected => {
        if (selectedAccordion.includes(indexSelected)) {
            setSelectedAccordion([]);
        } else {
            const newSelectedAccordion = [];
            newSelectedAccordion.push(indexSelected);
            setSelectedAccordion(newSelectedAccordion);
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
                    toggleAccordion,
                    isShowMore: (selectedAccordion || []).includes(index),
                    icon: props.icon,
                    ...child.props,
                }))
            }
        </AccordionView>
    );
}

export default Accordion;
