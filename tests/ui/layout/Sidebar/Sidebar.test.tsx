import '@testing-library/jest-dom';
import Sidebar from '../../../../src/ui/layout/Sidebar/Sidebar';
import {JSXWrapper, getElementByClassName, render} from '../../../helpers';
import SidebarMockView from './SidebarMockView';

describe('Sidebar tests', () => {
    const expectedSidebarClass = 'SidebarView';

    const props = {
        view: SidebarMockView,
    };

    it('should be in the document', () => {
        const {container, debug} = render(JSXWrapper(Sidebar, props));

        const sidebar = getElementByClassName(container, expectedSidebarClass);

        expect(sidebar).toBeInTheDocument();
    });
});
