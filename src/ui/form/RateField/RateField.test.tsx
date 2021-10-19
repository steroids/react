import 'jest-enzyme';
import RateFieldView from '@steroidsjs/bootstrap/form/RateField/RateFieldView';
import mountWithApp from '../../../../tests/mountWithApp';
import {IRateFieldProps} from './RateField';

const RateField = require('./RateField').default;

describe('RateField tests', () => {
    it('should render something without props', () => {
        const wrapper = mountWithApp(RateField);
        expect(wrapper).not.toBeEmptyRender();
    });

    describe('Static props', () => {
        const props: IRateFieldProps = {
            className: 'test',
            itemsCount: 3,
            defaultValue: 2,
            required: true,
            disabled: true,
            inputProps: {},
        };

        const wrapper = mountWithApp(RateField, {...props, view: RateFieldView });

        it('should static props transmitted unchanged', () => {
            expect(wrapper.find('RateField')).toHaveProp(props);
        });
        it('should have right external className', () => {
            expect(wrapper.find('RateField')).toHaveClassName(props.className);
        });
        it('should have right items number ', () => {
            expect(wrapper.find('.RateFieldView__rate-item')).toHaveLength(props.itemsCount);
        });
        it('should have right default value', () => {
            expect(wrapper.find('.RateFieldView__rate-item_is-full')).toHaveLength(props.defaultValue);
        });
        it('should be disabled', () => {
            expect(wrapper.find('RateField')).toBeDisabled();
        });
    });

    describe('Actions', () => {
        it('should allowClear clear value after second click on the last active star', () => {
            const props: IRateFieldProps = {
                allowClear: true,
                inputProps: {},
            };

            const wrapper = mountWithApp(RateField, {...props, view: RateFieldView});

            expect(wrapper.find('RateField')).toHaveProp(props);

            expect(wrapper.find('.RateFieldView__rate-item_is-full')).not.toExist();

            wrapper.find('.RateFieldView__rate-item').at(2).simulate('click');

            expect(wrapper.find('.RateFieldView__rate-item_is-full')).toHaveLength(3);

            wrapper.find('.RateFieldView__rate-item').at(2).simulate('click');

            expect(wrapper.find('.RateFieldView__rate-item_is-full')).toHaveLength(0);
        });
    });
});
