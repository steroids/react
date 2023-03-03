import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent, screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {render} from '../../../customRender';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import DropDown, {IDropDownProps} from '../../../../src/ui/content/DropDown/DropDown';
import Portal from '../../../../src/ui/layout/Portal';

describe('DropDown tests', () => {
    const console = global.console;

    beforeAll(() => {
        //Workaround with directly dom rendering in document.body
        global.console.error = jest.fn();
    });

    const contentText = 'Test Data';
    const buttonText = 'test button';
    const externalClass = 'externalClass';

    const props = {
        content: () => <div>{contentText}</div>,
        position: 'top',
        closeMode: 'click-away',
        children:
    <button>
        {buttonText}
    </button>,
        className: externalClass,

    } as IDropDownProps;

    const renderComponent = () => {
        const {getByText, container} = render(JSXWrapper(DropDown, props, true),
            {
                container: document.body,
            });

        const dropDownDispatcher = getByText(buttonText);

        return {dropDownDispatcher, getByText, container};
    };

    const expectedDropDownClass = 'DropDownView';

    it('should appear in the document', () => {
        const {container, dropDownDispatcher} = renderComponent();
        fireEvent.click(dropDownDispatcher);
        const dropDown = getElementByClassName(container, expectedDropDownClass);

        expect(dropDown).toBeInTheDocument();
    });

    it('should have correct position', () => {
        const {container, dropDownDispatcher} = renderComponent();
        fireEvent.click(dropDownDispatcher);
        const dropDown = getElementByClassName(container, expectedDropDownClass);

        expect(dropDown).toHaveClass(`${expectedDropDownClass}_position-top`);
    });

    it('should have external class and right content', () => {
        const {container, dropDownDispatcher, getByText} = renderComponent();
        fireEvent.click(dropDownDispatcher);

        const dropDown = getElementByClassName(container, expectedDropDownClass);
        const content = getByText(contentText);

        expect(dropDown).toHaveClass(externalClass);
        expect(content).toBeInTheDocument();
    });

    //TODO Action with close

    afterAll(() => {
        global.console = console;
    });
});
