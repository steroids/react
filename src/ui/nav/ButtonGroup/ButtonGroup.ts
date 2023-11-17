import React, {Dispatch, SetStateAction, useState} from 'react';
import {IButtonProps} from '../../form/Button/Button';
import {useComponents} from '../../../hooks';
import useDataProvider, {DataProviderItems} from '../../../hooks/useDataProvider';

/**
 * ButtonGroup
 *
 * Компонент ButtonGroup отображает группу кнопок.
 **/
export interface IButtonGroupProps extends IUiComponent {
    /**
     * Элементы для группы кнопок
     * @example ['button1', 'button2', 'button3']
     */
    items: DataProviderItems,

    /**
     * Функция, которая будет вызываться при клике по кнопке
     * @example setActiveTab
     */
    onClick: ((value: number | string | boolean) => void) | Dispatch<SetStateAction<string | number | boolean>>,

    /**
     * При указании в связке с onClick предоставляет возможность реализовать two-way binding
     * @example 'button1'
     */
    activeButton?: number | string,

    /**
    * Кнопка по умолчанию.
    */
    defaultActiveButton?: number | string;

    /**
     * Общие свойства для всех кнопок группы
     * @example {outline: true, color: 'secondary'}
     */
    buttonProps?: IButtonProps,
}

export interface IButtonGroupViewProps extends Omit<IButtonGroupProps, 'items'> {
    items: {
        id: number | string | boolean,
        label?: string,
        [key: string]: unknown,
    }[],
    size: Size,
}

const DEFAULT_BUTTON_GROUP_SIZE = 'md';

function ButtonGroup(props: IButtonGroupProps): JSX.Element {
    const components = useComponents();

    const {items} = useDataProvider({
        items: props.items,
    });

    const [activeButton, setActiveButton] = useState(props.activeButton || props.defaultActiveButton || items[0]?.id);

    React.useEffect(() => {
        if (props.activeButton) {
            setActiveButton(props.activeButton);
        }
    }, [props.activeButton]);

    const onClick = (buttonId: number | string | boolean) => {
        setActiveButton(buttonId);
        props.onClick(buttonId);
    };

    return components.ui.renderView(props.view || 'nav.ButtonGroupView', {
        className: props.className,
        style: props.style,
        buttonProps: props.buttonProps,
        size: props.buttonProps?.size || DEFAULT_BUTTON_GROUP_SIZE,
        activeButton,
        items,
        onClick,
    });
}

export default ButtonGroup;
