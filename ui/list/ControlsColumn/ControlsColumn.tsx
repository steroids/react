import _upperFirst from 'lodash-es/upperFirst';
import {useComponents} from '@steroidsjs/core/hooks';
import {useMemo} from 'react';
import {IButtonProps} from '../../form/Button/Button';
import {IControlItem} from '../../nav/Controls/Controls';

export interface IControlsColumnItem extends IButtonProps {
    rule?: 'view' | 'update' | 'delete' | string,
    visible?: boolean,
}

export interface IControlsColumnProps {
    primaryKey?: string;
    controls?: IControlItem[] | ((item: any, primaryKey: string) => IControlItem[]);
    item?: any;
    view?: any;

    [key: string]: any;
}

export interface IControlsColumnViewProps {
    items: IControlsColumnItem[],
}

export default function ControlsColumn(props: IControlsColumnProps) {
    const components = useComponents();

    const items = useMemo(
        () => {
            const controls = typeof props.controls === 'function'
                ? props.controls(props.item, props.primaryKey)
                : props.controls

            return controls.map(control => ({
                ...control,
                position: 'left',
                visible: control.visible !== false && this.props.item['can' + _upperFirst(control.id)] !== false,
            }))
        },
        [props]
    );

    return components.ui.renderView(props.view || 'list.ControlsColumnView', {
        ...props,
        items,
    });
}
