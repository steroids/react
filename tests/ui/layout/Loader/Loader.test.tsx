import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import Loader from '../../../../src/ui/layout/Loader';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import LoaderMockView from './LoaderMockView';

describe('Loader tests', () => {
    const props = {
        view: LoaderMockView,
    };

    const expectedLoaderClass = 'LoaderView';
    const wrapper = JSXWrapper(Loader, props);

    it('should be in the document', () => {
        const {container} = render(wrapper);
        const loader = getElementByClassName(container, expectedLoaderClass);

        expect(loader).toBeInTheDocument();
    });
});
