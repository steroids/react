import '@testing-library/jest-dom';
import Format, {IFormatProps} from '../../../src/ui/format/Format/Format';
import {JSXWrapper, render} from '../../helpers';

describe('Format tests', () => {
    const emptyText = 'test';

    const props: IFormatProps = {
        emptyText,
    };

    it('should be in the document', () => {
        const {getByText} = render(JSXWrapper(Format, props));
        const testText = getByText(emptyText);
        expect(testText).toBeInTheDocument();
    });
});
