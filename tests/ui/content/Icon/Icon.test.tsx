import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import {render} from '../../../customRender';
import Icon from '../../../../src/ui/content/Icon/Icon';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import IconMockView from './IconMockView';

describe('Icon tests', () => {
    const props = {
        view: IconMockView,
        name: 'mockIcon',
    };

    it('should be in the document with default', () => {
        const {container} = render(JSXWrapper(Icon, props));
        const field = getElementByClassName(container, 'IconView');
        screen.debug();
        expect(field).toBeInTheDocument();
    });
});
