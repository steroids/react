import * as React from 'react';
import { useComponents } from '@steroidsjs/core/hooks';

export interface ICollapseProps {
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
     * Кастомная иконка svg или название иконки
     * @example {'circle'}
     */
    icon?: React.ReactNode | string,

    /**
     * Показ иконки, которая показывает состояние CollapseItem. Поумолчанию включены.
     * @example {false}
     */
    showIcon?: boolean,

    /**
     * Позиция иконки-индикатора
     * @example {'left'}
     */
    iconPosition?: 'left' | 'right',

    /**
     * Включает режим Аккордиона (только один CollapseItem может быть открыт)
     * @example {true}
     */
    isAccordion?: boolean,

    /**
     * Номер активного CollapseItem, который может меняться динамический или быть статичным
     * @example
     */
    activeKey?: number,

    /**
     * Вызываемая функция при каждом изменении состояния
     * @example {() => {console.log('success')}}
     */
    onChange?: (state) => void,

    /**
     * Отключение внешних рамок
     * @example {true}
     */
    borderless?: boolean,
}

export interface ICollapseViewProps extends ICollapseProps{
    toggleCollapse: (number) => void,
    toggleAccordion: (number) => void,
    childIndex: number,
    isShowMore?: boolean,
}

function Collapse(props: ICollapseProps) {
    const [state, setState] = React.useState<number[]>([]);

    React.useEffect(() => {
        if (props.onChange) {
            props.onChange(state);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const toggleCollapse = (indexSelected) => {
        if (state.includes(indexSelected)) {
            const newState = [...state];
            const indexInArray = state.indexOf(indexSelected);
            newState.splice(indexInArray, 1);
            setState(newState);
        } else {
            const newState = [...state];
            newState.push(indexSelected);
            setState(newState);
        }
    };

    const toggleAccordion = indexSelected => {
        if (state.includes(indexSelected)) {
            setState([]);
        } else {
            const newState = [];
            newState.push(indexSelected);
            setState(newState);
        }
    };

    const components = useComponents();
    const CollapseView = components.ui.getView(props.view || 'content.CollapseView');

    return (
        <CollapseView
            {...props}
        >
            {
                React.Children.map(props.children, (child: any, index) => React.cloneElement(child, {
                    style: props.style,
                    activeKey: props.activeKey,
                    isAccordion: props.isAccordion,
                    childIndex: index,
                    toggleAccordion,
                    toggleCollapse,
                    isShowMore: (state || []).includes(index),
                    icon: props.icon,
                    showIcon: props.showIcon,
                    iconPosition: props.iconPosition,
                    borderless: props.borderless,
                    ...child.props}))
            }
        </CollapseView>
    );
}

Collapse.defaultProps = {
    iconPosition: 'right',
    showIcon: true,
};

export default Collapse;
