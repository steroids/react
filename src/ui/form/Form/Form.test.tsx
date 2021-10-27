import 'jest-enzyme';
import mountWithApp from '../../../../tests/mountWithApp';
import Form from './Form';
import InputField from '../InputField';
import PasswordField from '../PasswordField';
import CheckboxField from '../CheckboxField';

describe('Form tests', () => {
    it('should render nothing without props', () => {
        const wrapper = mountWithApp(Form);
        expect(wrapper.find('Form')).toBeEmptyRender();
    });

    describe('Static props', () => {
        const props = {
            autoStartTwoFactor: false,
            className: 'test',
            fields: [
                {
                    component: InputField,
                    attribute: 'email',
                    label: 'Email',
                    required: true,
                },
                {
                    component: PasswordField,
                    attribute: 'password',
                    label: 'Password',
                    placeholder: 'test',
                },
                {
                    component: CheckboxField,
                    attribute: 'acceptWithPolicy',
                    label: 'Accept with Policy',
                    disabled: true,
                },
            ],
            formId: 'LoginForm',
            layout: 'horizontal',
            style: {width: '45%'},
            submitLabel: 'Go ahead!',
            validators: [['email', 'required'], ['password', 'required'], ['acceptWithPolicy', 'required']],
        };

        const wrapper = mountWithApp(Form, {...props});

        it('should static props transmitted unchanged', () => {
            expect(wrapper.find('Form')).toHaveProp(props);
        });
        it('should render right fields', () => {
            expect(wrapper.find('InputField')).toExist();
            expect(wrapper.find('PasswordField')).toExist();
            expect(wrapper.find('CheckboxField')).toExist();
        });
        it('should render with right layout', () => {
            expect(wrapper.find('.FormView')).toHaveClassName(`form-${props.layout}`);
            expect(wrapper.find('.FieldLayoutView')).toHaveClassName(`FieldLayoutView_layout_${props.layout}`);
        });

        it('should have right external className', () => {
            expect(wrapper.find('form')).toHaveClassName(props.className);
        });
        it('should have right external style ', () => {
            expect(wrapper.find('Form')).toHaveProp('style', props.style);
        });
        it('should submit-button have right label', () => {
            expect(wrapper.find('.ButtonView__label')).toHaveText(props.submitLabel);
        });

        describe('Form fields', () => {
            it('should InputField have right props', () => {
                expect(wrapper.find('InputField')).toHaveProp(props.fields[0]);
            });

            it('should PasswordField have right props', () => {
                expect(wrapper.find('PasswordField')).toHaveProp(props.fields[1]);
            });

            it('should CheckboxField have right props', () => {
                expect(wrapper.find('CheckboxField')).toHaveProp(props.fields[2]);
            });
        });
    });
});
