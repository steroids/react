import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import {getElementByClassName, getElementByTag, JSXWrapper} from '../../../helpers';
import AutoCompleteField, {IAutoCompleteFieldProps} from '../../../../src/ui/form/AutoCompleteField/AutoCompleteField';
import AutoCompleteFieldMockView from './AutoCompleteFieldMockView';

describe('AutoCompleteField tests', () => {
    const expectedAutoCompleteClassName = 'AutoCompleteFieldView';
    const externalClassName = 'externalClassName';

    const itemWithAdditional = {
        id: '1',
        label: 'Egor',
        category: 'QA',
        additional: {
            icon: 'mockIcon',
            text: 'Senior',
        },
    };

    const defaultItem = {
        id: '2',
        label: 'Egor',
    };

    const externalStyle = {
        width: '30px',
    };

    const props: IAutoCompleteFieldProps = {
        items: [
            itemWithAdditional,
            defaultItem,
        ],
        isOpened: true,
        view: AutoCompleteFieldMockView,
        className: externalClassName,
        style: externalStyle,
        placeholder: 'placeholder',
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(AutoCompleteField, props));
        const autoComplete = getElementByClassName(container, expectedAutoCompleteClassName);
        expect(autoComplete).toBeInTheDocument();
    });

    it('should have external class, styles and placeholder', () => {
        const {container} = render(JSXWrapper(AutoCompleteField, props));

        const autocompleteField = getElementByClassName(container, expectedAutoCompleteClassName);
        const input = getElementByClassName(container, `${expectedAutoCompleteClassName}__input`);

        expect(autocompleteField).toHaveClass(externalClassName);
        expect(autocompleteField).toHaveStyle(externalStyle);
        expect(input).toHaveAttribute('placeholder', props.placeholder);
    });

    it('should have correct size', () => {
        const {container} = render(JSXWrapper(AutoCompleteField, props));
        const autoCompleteSize = getElementByClassName(container, `${expectedAutoCompleteClassName}_size_md`);
        expect(autoCompleteSize).toBeInTheDocument();
    });

    it('should have items and category', () => {
        const {container, getByText} = render(JSXWrapper(AutoCompleteField, props));
        const expectedItemsCount = 2;

        const category = getByText(itemWithAdditional.category);
        const additionalText = getByText(itemWithAdditional.additional.text);
        const icon = getElementByClassName(container, 'IconView');
        const items = container.querySelectorAll(`.${expectedAutoCompleteClassName}__drop-down-item`);

        expect(category).toBeInTheDocument();
        expect(additionalText).toBeInTheDocument();
        expect(icon).toBeInTheDocument();
        expect(items.length).toBe(expectedItemsCount);
    });
});
