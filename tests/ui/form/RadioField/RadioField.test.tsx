import '@testing-library/jest-dom';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import RadioFieldView from './RadioFieldMockView';
import RadioField from '../../../../src/ui/form/RadioField/RadioField';

describe('RadioField tests', () => {
    const expectedRadioFieldClassName = 'RadioFieldView';
    const externalClassName = 'test-class';

    const props = {
        view: RadioFieldView,
        className: externalClassName,
        size: 'lg',
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(RadioField, props));
        const radioField = getElementByClassName(container, expectedRadioFieldClassName);
        expect(radioField).toBeInTheDocument();
    });

    it('should have external className and styles', () => {
        const {container} = render(JSXWrapper(RadioField, props));
        const radioField = getElementByClassName(container, expectedRadioFieldClassName);

        expect(radioField).toHaveClass(externalClassName);
    });
});
