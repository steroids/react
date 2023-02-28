import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import AccordionItemMockView from './AccordionItemMockView';
import {IAccordionCommonViewProps} from '../../../../src/ui/content/Accordion/Accordion';
import AccordionItem from '../../../../src/ui/content/Accordion/AccordionItem';
import {getElementByClassName, JSXWrapper} from '../../../helpers';

describe('AccordionItem', () => {
    const defaultProps: IAccordionCommonViewProps = {
        view: AccordionItemMockView,
    };

    const expectedAccordionItemClass = 'AccordionItemView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(AccordionItem, defaultProps));
        const accordionItem = getElementByClassName(container, expectedAccordionItemClass);

        expect(accordionItem).toBeInTheDocument();
    });

    it('should have correct external style, external className, position, theme, icon, content', () => {
        const externalStyle = {
            width: '30px',
        };

        const theme = 'light';
        const position = 'bottom';
        const externalClassName = 'test-class';
        const title = 'accordion-title';
        const content = 'accordion-content';

        const {container, getByText} = render(JSXWrapper(AccordionItem, defaultProps, {
            style: externalStyle,
            theme,
            position,
            className: externalClassName,
            title,
            children: content,
        }));

        const accordionItem = getElementByClassName(container, expectedAccordionItemClass);
        const accordionIcon = getElementByClassName(container, `${expectedAccordionItemClass}__icon`);
        const accordionTitle = getByText(title);
        const accordionContent = getByText(content);

        expect(accordionItem).toHaveStyle(externalStyle);
        expect(accordionItem).toHaveClass(`${expectedAccordionItemClass}_theme_${theme}`);
        expect(accordionItem).toHaveClass(`${expectedAccordionItemClass}_position_${position}`);
        expect(accordionItem).toHaveClass(`${externalClassName}`);
        expect(accordionIcon).toBeInTheDocument();
        expect(accordionTitle).toBeInTheDocument();
        expect(accordionContent).toBeInTheDocument();
    });

    it('should have external icon', () => {
        const {container} = render(JSXWrapper(AccordionItem, defaultProps, {
            icon: {
                open: 'default',
                close: 'default',
            },
        }));

        const accordionIcon = getElementByClassName(container, 'IconView');
        expect(accordionIcon).toBeInTheDocument();
    });
});

//TODO Action
