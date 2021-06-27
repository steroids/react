import _upperFirst from 'lodash-es/upperFirst';
import {useMemo} from 'react';
import {useComponents} from '../../../hooks';
import {IButtonProps} from '../../form/Button/Button';
import {IControlItem} from '../../nav/Controls/Controls';

export interface IControlsColumnItem extends IButtonProps {
    rule?: 'view' | 'update' | 'delete' | string,
    visible?: boolean,
}

/**
 * ControlsColumn
 * Колонка для контролов
 */
export interface IControlsColumnProps {
    /**
     * Первичный ключ
     */
    primaryKey?: string;

    /**
     * Коллекция с контролами
     * @example [{id: 'delete'}, {id: 'view', position: 'left'}]
     */
    controls?: IControlItem[] | ((item: any, primaryKey: string) => IControlItem[]);

    /**
     * Элемент, для которого будет отображаться список с контролами, в нём можно задать видимость контрола
     * с помощью свойства 'can' + _upperFirst(control.id)
     * @example {name: 'Ivan', work: 'development', canView: false}
     */
    item?: any;

    /**
     * Переопределение view React компонента для кастомизации отображения колонки
     * @example MyCustomView
     */
    view?: any;

    [key: string]: any;
}

export interface IControlsColumnViewProps {
    items: IControlsColumnItem[],
}

export default function ControlsColumn(props: IControlsColumnProps): JSX.Element {
    const components = useComponents();

    const items = useMemo(
        () => {
            const controls = typeof props.controls === 'function'
                ? props.controls(props.item, props.primaryKey)
                : props.controls;

            return controls.map(control => ({
                ...control,
                position: 'left',
                visible: control.visible !== false && props.item['can' + _upperFirst(control.id)] !== false,
            }));
        },
        [props],
    );

    return components.ui.renderView(props.view || 'list.ControlsColumnView', {
        ...props,
        items,
    });
}
