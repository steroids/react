import '@testing-library/jest-dom';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import Empty from '../../../../src/ui/list/Empty/Empty';

describe('Empty tests', () => {
    const expectedEmptyClass = 'EmptyView';

    const props = {};

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(Empty, props));
        const empty = getElementByClassName(container, expectedEmptyClass);
        expect(empty).toBeInTheDocument();
    });
});
