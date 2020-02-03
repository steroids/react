import * as React from 'react';
import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';
import dataProviderHoc from '../dataProviderHoc';

interface ISwitcherFieldProps {
    label?: string | boolean;
    hint?: string;
    attribute?: string;
    input?: {
        name?: string,
        value?: any,
        onChange?: (...args: any[]) => any
    };
    required?: boolean;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    onChange?: (...args: any[]) => any;
    className?: string;
    view?: any;
    items?: {
        id?: number | string | boolean,
        label?: string
    }[];
    buttonProps?: any;
    onItemClick?: any;
    map?: any;
    getView?: any;
    ui?: any;
    selectedItems?: any;
    hoveredItem?: any;
}

@fieldHoc({
    componentId: 'form.SwitcherField'
})
@dataProviderHoc()
@components('ui')
export default class SwitcherField extends React.PureComponent<ISwitcherFieldProps,
    {}> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: "",
        errors: []
    };

    render() {
        const SwitcherFieldView =
            this.props.view || this.props.ui.getView('form.SwitcherFieldView');
        return (
            <SwitcherFieldView
                {...this.props}
                items={this.props.items.map(item => ({
                    ...item,
                    isSelected: !!this.props.selectedItems.find(
                        selectedItem => selectedItem.id === item.id
                    ),
                    isHovered:
                        this.props.hoveredItem && this.props.hoveredItem.id === item.id
                }))}
                onItemClick={this.props.onItemClick}
            />
        );
    }
}
