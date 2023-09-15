/* eslint-disable import/no-extraneous-dependencies */
import _isString from 'lodash-es/isString';
import _isInteger from 'lodash-es/isInteger';
import _set from 'lodash-es/set';
import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import _size from 'lodash-es/size';
import _isFunction from 'lodash-es/isFunction';
import dayjs from 'dayjs';

const validate = (data, rules) => {
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
                    if (value && !dayjs(value, 'YYYY-MM-DD').isValid()) {
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
                        } else if (
                            (params.min || params.min === 0)
                            && _size(value) < params.min
                        ) {
                            errors[attribute] = __('String is too short, min: {min}', {
                                min: params.min,
                            });
                        }
                    }
                    break;
                default:
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
        // TODO
        // throw new SubmissionError(errors);
    }
};
// validate.error = (attribute, message) => {
//     // TODO
//     // throw new SubmissionError({
//     //     [attribute]: message
//     // });
// };
export default validate;
