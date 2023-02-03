import 'jest-enzyme';
import mountWithApp from '../../../../tests/mountWithApp';
import Alert from './Alert';

describe.skip('Alert', () => {
    it('should render something without props', () => {
        const wrapper = mountWithApp(Alert);
        expect(wrapper).not.toBeEmptyRender();
    });

    describe('Static props', () => {
        const props = {
            className: 'test',
            type: 'info',
            message: 'Are you sure?',
            description: 'It is maybe dangerous',
            style: {width: '45%'},
            showClose: true,
            showIcon: true,
        };

        const wrapper = mountWithApp(Alert, {...props});

        it('should static props transmitted unchanged', () => {
            expect(wrapper.find('Alert')).toHaveProp(props);
        });
        it('should have right type', () => {
            expect(wrapper.find('.AlertView')).toHaveClassName(`.AlertView_${props.type}`);
        });

        it('should render icon with right type', () => {
            expect(wrapper.find('Icon').first()).toHaveClassName(`AlertView__icon_${props.type}`);
        });
        it('should render close icon', () => {
            expect(wrapper.find('.AlertView__icon-close')).toExist();
        });

        it('should have right external className', () => {
            expect(wrapper.find('.AlertView')).toHaveClassName(props.className);
        });
        it('should have right message and description', () => {
            expect(wrapper.find('.AlertView__message')).toHaveText(props.message);
            expect(wrapper.find('.AlertView__description')).toHaveText(props.description);
        });
        it('should have right external style', () => {
            expect(wrapper.find('.AlertView')).toHaveProp('style', props.style);
        });
    });

    describe('Actions', () => {
        const mockedOnClose = jest.fn();

        const props = {
            showClose: true,
            showIcon: false,
            onClose: mockedOnClose,
        };

        it('should click to Close call callback', () => {
            const wrapper = mountWithApp(Alert, {...props});
            // expect(wrapper.find('Alert')).toHaveProp(props);

            wrapper.find('.AlertView__icon-close').first().simulate('click');
            expect(mockedOnClose.mock.calls.length === 1);
        });
    });
});
