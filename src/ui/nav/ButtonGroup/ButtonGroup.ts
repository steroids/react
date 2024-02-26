import {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from 'react';
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
     * @example
     * [
     *  'button1',
     *  'button2',
     *  'button3'
     * ]
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
    defaultActiveButton?: number | string,

    /**
     * Общие свойства для всех кнопок группы
     * @example
     * {
     *  outline: true,
     *  color: 'secondary'
     * }
     */
    buttonProps?: IButtonProps,

    /**
     * Свойства для компонента отображения
     * @example
     * {
     *  customHandler: () => {...}
     * }
     */
    viewProps?: {
        [key: string]: any,
    },
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

    useEffect(() => {
        if (props.activeButton) {
            setActiveButton(props.activeButton);
        }
    }, [props.activeButton]);

    const onClick = useCallback((buttonId: number | string | boolean) => {
        setActiveButton(buttonId);
        props.onClick(buttonId);
    }, [props]);

    const viewProps = useMemo(() => ({
        className: props.className,
        style: props.style,
        buttonProps: props.buttonProps,
        size: props.buttonProps?.size || DEFAULT_BUTTON_GROUP_SIZE,
        activeButton,
        items,
        onClick,
        viewProps: props.viewProps,
    }), [activeButton, items, onClick, props.buttonProps, props.className, props.style, props.viewProps]);

    return components.ui.renderView(props.view || 'nav.ButtonGroupView', viewProps);
}

export default ButtonGroup;
