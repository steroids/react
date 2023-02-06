import 'jest-enzyme';
import mountWithApp from '../../../../tests/mountWithApp';
import FieldLayout from './FieldLayout';

describe.skip('FieldLayout', () => {
    it('should render something without props', () => {
        const wrapper = mountWithApp(FieldLayout);
        expect(wrapper.find(FieldLayout)).not.toBeEmptyRender();
    });

    describe('Static props', () => {
        const props = {
            label: 'FieldLayout',
            errors: 'Field is required',
            layout: 'horizontal',
            hint: 'Save', // When there are no errors in field and layout !== 'inline'
            required: true,
        };

        const wrapper = mountWithApp(FieldLayout, {...props});

        it('should static props transmitted unchanged', () => {
            expect(wrapper.find(FieldLayout)).toHaveProp(props);
        });
        it('should render label', () => {
            expect(wrapper.find('.FieldLayoutView__label')).toHaveText('FieldLayout:');
        });
        it('should render errors', () => {
            expect(wrapper.find('.FieldLayoutView__invalid-feedback')).toHaveText('Field is required');
        });
        it('should render hint', () => {
            expect(wrapper.find('.FieldLayoutView__hint')).not.toExist();
        });
        it('should be required', () => {
            expect(wrapper.find('.FieldLayoutView__label_required')).toExist();
        });
    });
});
