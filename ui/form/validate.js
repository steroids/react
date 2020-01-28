import _isString from 'lodash/isString';
import _isInteger from 'lodash/isInteger';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _size from 'lodash/size';
import _isFunction from 'lodash/isFunction';
import moment from 'moment';
import {SubmissionError} from 'redux-form';

const validate = function (data, rules) {
    const errors = {};
    rules.forEach(item => {
        const attributes = [].concat(item[0]);
        const rule = item[1];
        const params = item[2] || {};

        attributes.forEach(attribute => {
            let value = _get(data, attribute);
            switch (rule) {
                case 'required':
                    if (!value) {
                        errors[attribute] = __('Field is required');
                    }
                    break;

                case 'date':
                    if (value && !moment(value, 'YYYY-MM-DD').isValid()) {
                        errors[attribute] = __('Date wrong format');
                    }
                    break;

                case 'integer':
                case 'number':
                    if (value) {
                        if (_isString(value)) {
                            value = Number(value);
                        }
                        if (rule === 'integer' && !_isInteger(value)) {
                            errors[attribute] = __('Field must be integer');
                        } else if ((params.min || params.min === 0) && value < params.min) {
                            errors[attribute] = __('Value is too small, min: {min}', {
                                min: params.min,
                            });
                        } else if ((params.max || params.max === 0) && value > params.max) {
                            errors[attribute] = __('Value is too large, max: {max}', {
                                max: params.max,
                            });
                        }
                    }
                    break;

                case 'string':
                    params.max = params.max || 1000;
                    if (value) {
                        if (_isInteger(value)) {
                            value = String(value);
                        }
                        if (!_isString(value)) {
                            errors[attribute] = __('Field must be string');
                        } else if (_size(value) > params.max) {
                            errors[attribute] = __('String is too long, max: {max}', {
                                max: params.max,
                            });
                        } else if ((params.min || params.min === 0) && _size(value) < params.min) {
                            errors[attribute] = __('String is too short, min: {min}', {
                                min: params.min,
                            });
                        }
                    }
                    break;
            }

            if (_isFunction(rule)) {
                const error = rule(data, attribute);
                if (error) {
                    errors[attribute] = error;
                }
            }

            _set(data, attribute, value);
        });
    });

    if (!_isEmpty(errors)) {
        throw new SubmissionError(errors);
    }
};

validate.error = (attribute, message) => {
    throw new SubmissionError({
        [attribute]: message,
    });
};

export default validate;
