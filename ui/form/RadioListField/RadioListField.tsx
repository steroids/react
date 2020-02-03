import * as React from 'react';
import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';
import dataProviderHoc from '../dataProviderHoc';

interface IRadioListFieldProps {
    label?: string | boolean | any;
    hint?: string;
    attribute?: string;
    input?: {
        name?: string,
        value?: any,
        onChange?: (...args: any[]) => any
    };
    required?: boolean;
    isInvalid?: boolean;
    disabled?: boolean;
    inputProps?: any;
    onChange?: (...args: any[]) => any;
    className?: string;
    view?: any;
    items?: {
        id?: number | string | boolean,
        label?: string | any
    }[];
    onItemClick?: any;
    map?: any;
    getView?: any;
    ui?: any;
    selectedItems?: any;
    hoveredItem?: any;
}

@fieldHoc({
    componentId: 'form.RadioListField'
})
@dataProviderHoc()
@components('ui')
export default class RadioListField extends React.PureComponent<IRadioListFieldProps,
    {}> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: "",
        errors: []
    };

    render() {
        const RadioListFieldView =
            this.props.view || this.props.ui.getView('form.RadioListFieldView');
        return (
            <RadioListFieldView
                {...this.props}
                inputProps={{
                    name: this.props.input.name,
                    type: 'radio',
                    ...this.props.inputProps,
                    disabled: this.props.disabled
                }}
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
