import * as React from 'react';
import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';

interface ISliderFieldProps {
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
    sliderProps?: any;
    onChange?: (...args: any[]) => any;
    className?: string;
    view?: any;
    min?: number;
    max?: number;
    getView?: any;
    ui?: any;
}

@fieldHoc({
    componentId: 'form.SliderField'
})
@components('ui')
export default class SliderField extends React.PureComponent<ISliderFieldProps,
    {}> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: "",
        errors: [],
        min: 0,
        max: 100
    };

    static normalizeValue(value) {
        return parseInt(String(value).replace(/[0-9]g/, "")) || 0;
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
