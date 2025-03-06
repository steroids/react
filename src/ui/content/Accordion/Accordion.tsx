import * as React from 'react';
import {useMemo, useCallback} from 'react';
import {useComponents} from '../../../hooks';

export interface IAccordionIcon {
    /**
    * Пользовательская иконка открытия
    * @example 'user'
    */
    open: React.ReactElement | string,
    /**
    * Пользовательская иконка закрытия
    * @example 'user'
    */
    close: React.ReactElement | string,
}

/**
 * Accordion
 *
 * Компонент-аккордеон позволяет создавать интерактивные списки или контейнеры,
 * где содержимое может быть развернуто или свернуто по требованию пользователя.
 * Каждый элемент аккордеона может быть раскрытым или свернутым, и пользователь может
 * изменять их состояние путем нажатия на соответствующий заголовок элемента.
 *
 * Компонент `Accordion` обычно используется для создания разделов, подразделов или
 * списков, где необходимо показывать или скрывать дополнительную информацию по требованию.
 *
 * Внутри компонента `Accordion` могут быть использованы дочерние элементы `AccordionItem`,
 * каждый из которых представляет отдельный элемент аккордеона с заголовком и содержимым.
 * При нажатии на заголовок, соответствующий элемент может быть развернут или свернут.
 *
 * Примечание: В компоненте `Accordion` должен быть указан хотя бы один дочерний элемент `AccordionItem`.
 */
export interface IAccordionProps extends IUiComponent {
    /**
    * Дочерние элементы
    */
    children?: React.ReactNode[],

    /**
     * Переводит Accordion в выключенное состояние
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
    theme?: 'light' | 'dark' | 'intermediate',

    /**
     * Номер активного AccordionItem, который может меняться динамический или быть статичным
     * @example 1
     */
    activeKey?: number,

    /**
     * Вызываемая функция при каждом изменении состояния
     * @example
     * {
     *  () => { console.log('success') }
     * }
     */
    onChange?: () => void,

    /**
     * Флаг, отвечающий за автоматическое добавление position: "top" к первому AccordionItem и position: "bottom" к последнему
     * По умолчанию true
     * @example false
     */
    isAutoPosition?: boolean,

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

export interface IAccordionItemProps extends Omit<IAccordionProps, 'onChange'> {
    toggleAccordion?: (number) => void,
    toggleCollapse?: (number) => void,
    childIndex?: number,
    isShowMore?: boolean,
}

export type IAccordionViewProps = Pick<IAccordionProps, 'children' | 'className'>

export type IAccordionItemViewProps = IAccordionItemProps & IUiComponent;

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

    const viewProps = useMemo(() => ({
        className: props.className,
        children: props.children,
    }), [props.children, props.className]);

    const AccordionView = components.ui.getView(props.view || 'content.AccordionView');

    const getAccordionItemPosition = useCallback((accordionItemIndex: number): string => {
        // Если необходимо, автоматически скругляем первый и последний AccordionItem
        if (accordionItemIndex === 0) {
            return 'top';
        }
        if (accordionItemIndex === (props.children.length - 1)) {
            return 'bottom';
        }
        return 'middle';
    }, [props.children]);

    return (
        <AccordionView {...viewProps}>
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
                    position: props.isAutoPosition && getAccordionItemPosition(index),
                    ...child.props,
                }))
            }
        </AccordionView>
    );
}

Accordion.defaultProps = {
    isAutoPosition: true,
};

export default Accordion;
