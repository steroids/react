import '@testing-library/jest-dom';
import FileSize, {IFileSizeProps} from '../../../src/ui/format/FileSize/FileSize';
import {JSXWrapper, render} from '../../helpers';
import DefaultFormatterMockView from './DefaultFormatterMockView';

describe('FileSize tests', () => {
    const props = {
        view: DefaultFormatterMockView,
    } as IFileSizeProps;

    it('should have correct value', () => {
        const valueBytes = 23400;
        const {getByText} = render(JSXWrapper(FileSize, {
            ...props,
            value: valueBytes,
        }));
        const value = getByText('23.4 kB');

        expect(value).toBeInTheDocument();
    });

    it('should the value become zero', () => {
        const showZero = true;
        const {getByText} = render(JSXWrapper(FileSize, {
            ...props,
            showZero,
        }));
        const value = getByText('0');

        expect(value).toBeInTheDocument();
    });
});
