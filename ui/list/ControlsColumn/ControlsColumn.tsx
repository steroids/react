import * as React from 'react';
import _upperFirst from 'lodash-es/upperFirst';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
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

interface IControlsColumnPrivateProps extends IComponentsHocOutput {

}

@components('ui')
export default class ControlsColumn extends React.PureComponent<IControlsColumnProps & IControlsColumnPrivateProps> {

    render() {
        const controls = typeof this.props.controls === 'function'
            ? this.props.controls(this.props.item, this.props.primaryKey)
            : this.props.controls;
        const ControlsColumnView = this.props.view || this.props.ui.getView('list.ControlsColumnView');
        return (
            <ControlsColumnView
                {...this.props}
                items={controls.map(control => ({
                    ...control,
                    position: 'left',
                    visible: control.visible !== false && this.props.item['can' + _upperFirst(control.id)] !== false,
                }))}
            />
        );
    }

}
