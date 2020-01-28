import React from 'react';
import PropTypes from 'prop-types';

import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';

@fieldHoc({
    componentId: 'form.SliderField',
})
@components('ui')
export default class SliderField extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        hint: PropTypes.string,
        attribute: PropTypes.string,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        required: PropTypes.bool,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        disabled: PropTypes.bool,
        sliderProps: PropTypes.object,
        onChange: PropTypes.func,
        className: PropTypes.string,
        view: PropTypes.elementType,
        min: PropTypes.number,
        max: PropTypes.number,
    };

    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        errors: [], //for storybook
        min: 0,
        max: 100,
    };

    static normalizeValue(value) {
        return parseInt(String(value).replace(/[0-9]g/, '')) || 0;
    }

    constructor() {
        super(...arguments);

        this._onChange = this._onChange.bind(this);
        this._onAfterChange = this._onAfterChange.bind(this);
    }

    render() {
        const SliderFieldView = this.props.view || this.props.ui.getView('form.SliderFieldView');
        return (
            <SliderFieldView
                {...this.props}
                slider={{
                    min: this.props.min,
                    max: this.props.max,
                    defaultValue: 0,
                    value: this.props.input.value || 0,
                    onChange: this._onChange,
                    onAfterChange: this._onAfterChange,
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
