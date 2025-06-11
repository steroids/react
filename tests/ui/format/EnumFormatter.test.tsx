import '@testing-library/jest-dom';
import EnumFormatter, {IEnumFormatterProps} from '../../../src/ui/format/EnumFormatter/EnumFormatter';
import {JSXWrapper, render} from '../../helpers';
import DefaultFormatterMockView from './DefaultFormatterMockView';

describe('EnumFormatter tests', () => {
    const itemId = 1;
    const props = {
        view: DefaultFormatterMockView,
        items: [{
            id: itemId,
            label: 'London',
        }],
        value: itemId,
    } as IEnumFormatterProps;

    const wrapper = JSXWrapper(EnumFormatter, props);
    it('should take correct label', () => {
        const {getByText} = render(wrapper);
        const label = getByText('London');

        expect(label).toBeInTheDocument();
    });
});
