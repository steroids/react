import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import Loader from '../../../../src/ui/layout/Loader';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import LoaderMockView from './LoaderMockView';

describe('Loader tests', () => {
    const props = {
        view: LoaderMockView,
        size: 'small',
        color: 'primary',
    };

    const expectedLoaderClass = 'LoaderView';
    const wrapper = JSXWrapper(Loader, props);

    it('should be in the document', () => {
        const {container} = render(wrapper);
        const loaderView = getElementByClassName(container, expectedLoaderClass);

        expect(loaderView).toBeInTheDocument();
    });

    it('should have correct class size/color', () => {
        const {container} = render(wrapper);
        const loader = getElementByClassName(container, `${expectedLoaderClass}__loader`);
        expect(loader).toHaveClass(`${expectedLoaderClass}__loader_size_${props.size}`);
        expect(loader).toHaveClass(`${expectedLoaderClass}__loader_color_${props.color}`);
    });
});
