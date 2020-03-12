import * as React from 'react';
import {components, field} from '../../../hoc';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface ISliderFieldProps extends IFieldHocInput {
    sliderProps?: any;
    className?: CssClassName;
    view?: CustomView;
    min?: number;
    max?: number;
}

export interface ISliderFieldViewProps extends IFieldHocOutput {
    slider: {
        min: number,
        max: number,
        defaultValue: number,
        value: number,
        onChange: (value: any) => void,
        onAfterChange: (value: any) => void,
    }
}

interface ISliderFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {

}

@field({
    componentId: 'form.SliderField'
})
@components('ui')
export default class SliderField extends React.PureComponent<ISliderFieldProps & ISliderFieldPrivateProps> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        errors: [],
        min: 0,
        max: 100
    };

    static normalizeValue(value) {
        return parseInt(String(value).replace(/[0-9]g/, '')) || 0;
    }

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this._onAfterChange = this._onAfterChange.bind(this);
    }

    render() {
        const SliderFieldView =
            this.props.view || this.props.ui.getView('form.SliderFieldView');
        return (
            <SliderFieldView
                {...this.props}
                slider={{
                    min: this.props.min,
                    max: this.props.max,
                    defaultValue: 0,
                    value: this.props.input.value || 0,
                    onChange: this._onChange,
                    onAfterChange: this._onAfterChange
                }}
            />
        );
    }

    _onChange(range) {
        this.props.input.onChange(range);
    }

    _onAfterChange(value) {
        value = SliderField.normalizeValue(value);
        this.props.input.onChange(value);
    }
}
