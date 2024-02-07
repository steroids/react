import '@testing-library/jest-dom';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import FileFieldMockView from './FileFieldMockView';
import FileField, {IFileFieldProps} from '../../../../src/ui/form/FileField/FileField';

describe('FileField tests', () => {
    const props = {
        view: FileFieldMockView,
        className: 'externalClass',
        filesLayout: 'wall',
    } as IFileFieldProps;

    const expectedFileFieldClass = 'FileFieldView';

    it('should be in the document and have correct classes', () => {
        const {container} = render(JSXWrapper(FileField, props));
        const fileField = getElementByClassName(container, expectedFileFieldClass);

        expect(fileField).toBeInTheDocument();

        expect(fileField).toHaveClass(props.className);
        expect(fileField).toHaveClass(expectedFileFieldClass);
        expect(fileField).toHaveClass(`${expectedFileFieldClass}_isWall`);
    });
});
