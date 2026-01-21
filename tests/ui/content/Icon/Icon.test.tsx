import '@testing-library/jest-dom';
import IconMockView from './IconMockView';
import Icon from '../../../../src/ui/content/Icon/Icon';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('Icon tests', () => {
    const props = {
        view: IconMockView,
        name: 'mockIcon',
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(Icon, props));
        const icon = getElementByClassName(container, 'IconView');

        expect(icon).toBeInTheDocument();
    });
});
