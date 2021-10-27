import 'jest-enzyme';
import PasswordFieldView from '@steroidsjs/bootstrap/form/PasswordField/PasswordFieldView';
import PasswordField from './PasswordField';
import mountWithApp from '../../../../tests/mountWithApp';

describe('Password tests', () => {
    it('should render something without props', () => {
        const wrapper = mountWithApp(PasswordField, {view: PasswordFieldView});
        expect(wrapper).not.toBeEmptyRender();
    });

    describe('Static props', () => {
        const props = {
            type: 'password',
            disabled: true,
            required: true,
            className: 'test',
            placeholder: 'test',
            errors: ['Error text'],
            style: {width: '120px'},
        };

        const wrapper = mountWithApp(PasswordField, {...props, view: PasswordFieldView});

        it('should static props transmitted unchanged', () => {
            expect(wrapper.find('PasswordField')).toHaveProp(props);
        });
        it('should have right type', () => {
            expect(wrapper.find('input')).toHaveProp('type', props.type);
        });
        it('should have right placeholder', () => {
            expect(wrapper.find('input')).toHaveProp('placeholder', props.placeholder);
        });
        it('should have right external style', () => {
            expect(wrapper.find('PasswordField')).toHaveProp('style', props.style);
        });
        it('should have right external className', () => {
            expect(wrapper.find('PasswordField')).toHaveClassName(props.className);
        });
        it('should be required', () => {
            expect(wrapper.find('PasswordField')).toHaveProp('required', props.required);
        });
        it('should be disabled ', () => {
            expect(wrapper.find('input')).toBeDisabled();
        });
    });

    /// TODO Doesn't work now. Field is wrapped in two div
    // Render this:
    // <div className="PasswordFieldView">
    //  <div className="PasswordFieldView__container form-control form-control-undefined">
    //      <input className="PasswordFieldView__input" name="" type="hidden" placeholder="" value="">
    //  </div>

    // describe('Conditional props', () => {
    //     it('should render empty with type hidden', () => {
    //         const wrapper = mountWithApp(PasswordField, {inputProps: {type: 'hidden'}, view: PasswordFieldView});
    //         expect(wrapper).toBeEmptyRender();
    //     });
    // });

    //  </div>
    describe('Actions', () => {
        it('should value change', () => {
            const wrapper = mountWithApp(PasswordField, {view: PasswordFieldView});
            wrapper.find('input').simulate('change', { target: { value: 'test' } });
            expect(wrapper.find('input')).toHaveProp('value', 'test');
        });
    });
});
