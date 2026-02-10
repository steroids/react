import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';

import Menu, {IMenuProps} from '../../../../src/ui/content/Menu/Menu';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('Menu tests', () => {
    const console = global.console;

    beforeAll(() => {
        //Workaround with directly dom rendering in document.body
        global.console.error = jest.fn();
    });

    const voidFunction = () => {};
    const labelTest = 'Test';
    const props = {
        items: [
            {
                label: labelTest,
                icon: 'mockIcon',
                hasBorder: true,
                onClick: voidFunction,
            },
        ],
    } as IMenuProps;

    const expectedMenuClass = 'MenuView';
    const expectedMenuItemClass = 'MenuItemView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(Menu, props, true), {container: document.body});
        const menuButton = getElementByClassName(container, `${expectedMenuClass}__button`);
        fireEvent.click(menuButton);

        const menu = getElementByClassName(container, expectedMenuClass);
        const menuItem = getElementByClassName(container, expectedMenuItemClass);

        expect(menuButton).toBeInTheDocument();
        expect(menuItem).toBeInTheDocument();
        expect(menu).toBeInTheDocument();
    });

    it('should have menu icon', () => {
        const {container} = render(JSXWrapper(Menu, props));
        const menuIcon = getElementByClassName(container, `${expectedMenuClass}__icon`);

        expect(menuIcon).toBeInTheDocument();
    });

    it('should have correct props item', () => {
        const {container} = render(JSXWrapper(Menu, props, true), {container: document.body});
        const menuButton = getElementByClassName(container, `${expectedMenuClass}__button`);
        fireEvent.click(menuButton);

        const menu = getElementByClassName(container, expectedMenuClass);
        const menuItem = getElementByClassName(container, expectedMenuItemClass);
        const icon = getElementByClassName(container, `${expectedMenuItemClass}__icon`);
        const label = getElementByClassName(container, `${expectedMenuItemClass}__label`);

        expect(menuButton).toBeInTheDocument();
        expect(menu).toBeInTheDocument();
        expect(icon).toBeInTheDocument();

        expect(label).toHaveTextContent(labelTest);
        expect(menuItem).toHaveClass(`${expectedMenuItemClass}_hasBorder`);
    });

    afterAll(() => {
        global.console = console;
    });
});
