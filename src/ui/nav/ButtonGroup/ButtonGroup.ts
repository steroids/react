import {IButtonProps} from 'src/ui/form/Button/Button';
import {useState} from 'react';
import {useComponents} from '../../../hooks';
import useDataProvider, {DataProviderItems} from '../../../hooks/useDataProvider';

/**
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
    onClick: (value: number | string | boolean) => void,

    /**
     * Активная кнопка
     * @example 'button1'
     */
    activeButton?: number | string,

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

    const [activeButton, setActiveButton] = useState(props.activeButton || items[0].id);

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
