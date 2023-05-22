import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {render} from '../../../customRender';
import ButtonGroupMockView from './ButtonGroupMockView';
import {JSXWrapper, getElementByClassName, getElementByTag} from '../../../helpers';
import ButtonGroup from '../../../../src/ui/nav/ButtonGroup/ButtonGroup';

describe('ButtonGroup tests', () => {
    const items = [
        {
            id: 1,
            label: 'First',
        },
        {
            id: 2,
            label: 'Second',
        },
    ];

    const props = {
        view: ButtonGroupMockView,
        className: 'testClass',
        style: {marginBottom: '70px'},
        buttonProps: {
            size: 'sm',
            outline: true,
        },
        items,
        onClick: jest.fn(() => {}),
    };

    const expectedButtonGroupClass = 'ButtonGroupView';
    const wrapper = JSXWrapper(ButtonGroup, props);

    it('should be in the document and have className', () => {
        const {container} = render(wrapper);
        const buttonGroup = getElementByClassName(container, expectedButtonGroupClass);

        expect(buttonGroup).toBeInTheDocument();
        expect(buttonGroup).toHaveClass(props.className);
    });

    it('should have right size and right button props', () => {
        const {container} = render(wrapper);
        const buttonGroup = getElementByClassName(container, expectedButtonGroupClass);

        const expectedButtonClassWithOutline = 'ButtonView_outline';
        const buttons = buttonGroup.querySelectorAll(expectedButtonClassWithOutline);

        buttons.forEach(button => expect(button).toBeInTheDocument());
        expect(buttonGroup).toHaveClass(`${expectedButtonGroupClass}_size_sm`);
    });

    it('should have right style', () => {
        const {container} = render(wrapper);
        const buttonGroup = getElementByClassName(container, expectedButtonGroupClass);

        expect(buttonGroup).toHaveStyle(props.style);
    });

    it('should void onClick', () => {
        const {container} = render(wrapper);
        const button = getElementByTag(container, 'button');

        fireEvent.click(button);

        expect(props.onClick).toBeCalled();
    });

    it('should have first active button', () => {
        const {container} = render(wrapper);
        const activeButton = getElementByClassName(container, `${expectedButtonGroupClass}__button_active`);
        const firstButton = getElementByClassName(container, `${expectedButtonGroupClass}__button`);

        expect(activeButton).toEqual(firstButton);
    });

    it('should have custom active button', () => {
        const activeButton = items[1];
        const {container} = render(JSXWrapper(ButtonGroup, {
            ...props,
            activeButton: activeButton.id,
        }));

        const activeButtonElement = getElementByClassName(container, `${expectedButtonGroupClass}__button_active`);
        const expectedActiveButtonLabel = activeButton.label;

        expect(activeButtonElement).toHaveTextContent(expectedActiveButtonLabel);
    });
});
