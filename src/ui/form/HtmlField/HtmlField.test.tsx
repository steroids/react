import 'jest-enzyme';
import HtmlFieldView from '@steroidsjs/bootstrap/form/HtmlField/HtmlFieldView';
import HtmlField from './HtmlField';
import mountWithApp from '../../../../tests/mountWithApp';

describe('HtmlField tests', () => {
    /* @todo we don't want to test CKEditor, consider testing only props that are passed to the HtmlFieldView */
    xit('should render something without props', () => {
        const wrapper = mountWithApp(HtmlField, {view: HtmlFieldView});
        expect(wrapper).not.toBeEmptyRender();
    });

    // describe('Static props', () => {
    //     const props = {
    //         className: 'test',
    //         dark: true,
    //         disabled: true,
    //         error: ['Error text'],
    //         placeholder: 'test',
    //         required: true,
    //     };
    //
    //     const wrapper = mountWithApp(HtmlField, {...props, view: HtmlFieldView});
    //
    //     it('should static props transmitted unchanged', () => {
    //         expect(wrapper.find('HtmlField')).toHaveProp(props);
    //     });
    //     it('should have right external className', () => {
    //         expect(wrapper.find('HtmlField')).toHaveClassName(props.className);
    //     });
    //     it('should have dark mod', () => {
    //         expect(wrapper.find('HtmlField')).toHaveProp('dark', props.dark);
    //     });
    //     it('should have right placeholder', () => {
    //         expect(wrapper.find('HtmlField')).toHaveProp('placeholder', props.placeholder);
    //     });
    //     it('should be disabled', () => {
    //         expect(wrapper.find('HtmlField')).toBeDisabled();
    //     });
    // });

    /// TODO Doesn't work now.
    // console.log:
    //              Found node output: <div class="HtmlFieldView"><div></div></div>

    // describe('Action', () => {
    //     it('should value change', () => {
    //         const wrapper = mountWithApp(HtmlField, {view: HtmlFieldView});
    //         wrapper.find('HtmlField').simulate('change', {target: {value: 'test'}});
    //         expect(wrapper.find('HtmlField')).toHaveClassName('ck-blurred');
    //     });
    // });
});
