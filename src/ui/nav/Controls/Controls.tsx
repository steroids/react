import {useMemo} from 'react';
import {useComponents} from '../../../hooks';
import {IButtonProps} from '../../form/Button/Button';
import {INavProps} from '../Nav/Nav';

export interface IControlItem extends IButtonProps {
    /**
     * Идентификатор контрола
     * @example 'create'
     */
    id?: string,

    /**
     * Скрыть или показать контрол
     * @example true
     */
    visible?: boolean,

    /**
     * Расположение контрола
     * @example 'left'
     */
    position?: 'left' | 'right',
}

/**
 * Controls
 * Коллекция с контролами. Можно передавать список с кастомными контролами, а можно использовать стандарные контролы
 * компонента. Стандартные контролы подходят для CRUD-операций, все что нужно для их использования - передать
 * соответствующий id и обработчик - внешний вид (иконка и название) отобразятся автоматом.
 */
export interface IControlsProps {
    /**
     * Коллекция контролов
     * @example [{id: 'delete', onClick: () => alert("It's deleted")}]
     */
    items?: IControlItem[],

    /**
     * Пропсы для компонента Nav, в который передаются контролы в качестве items
     * @example {layout: 'link'}
     */
    navProps?: INavProps,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: any,

    /**
     * Дополнительный CSS-класс для элемента отображения
     * @example MyCustomView
     */
    className?: string,

    [key: string]: any,
}

export interface IControlsViewProps extends IControlsProps {
    className?: string,
    items: (IControlItem & {
        icon?: string,
        label?: string | any,
        confirm?: string,
        color?: ColorName,
        outline?: boolean,
        position?: 'right' | 'left'
    })[],
}

export default function Controls(props: IControlsProps): JSX.Element {
    const defaultItems = {
        index: {
            icon: 'back',
            label: __('К списку'),
            color: 'secondary',
            outline: true,
        },
        create: {
            icon: 'create',
            label: __('Добавить'),
            color: 'success',
            outline: true,
        },
        view: {
            icon: 'view',
            label: __('Просмотр'),
            color: 'secondary',
            outline: true,
        },
        update: {
            icon: 'update',
            label: __('Редактировать'),
            color: 'secondary',
            outline: true,
        },
        delete: {
            icon: 'delete',
            label: __('Удалить'),
            confirm: __('Удалить запись?'),
            color: 'danger',
            outline: true,
            position: 'right',
        },
    };

    const components = useComponents();
    const items = useMemo(() => props.items.map(item => ({
        ...defaultItems[item.id],
        ...item,
    })), [defaultItems, props.items]);

    return components.ui.renderView(props.view || 'nav.ControlsView', {
        ...props,
        items,
    });
}
