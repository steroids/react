import '@testing-library/jest-dom';
import {JSXWrapper, getElementByClassName, render} from '../../../helpers';
import Link, {ILinkProps} from '../../../../src/ui/nav/Link/Link';

describe('Link tests', () => {
    const expectedLinkClass = 'ButtonView';

    const props: ILinkProps = {
        url: 'https://google.ru',
        target: '_blank',
        label: 'Basic',
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(Link, props));
        const link = getElementByClassName(container, expectedLinkClass);
        expect(link).toBeInTheDocument();
    });
});
