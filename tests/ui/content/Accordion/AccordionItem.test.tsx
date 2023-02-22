import React from 'react';
import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import AccordionItemMockView from './AccordionItemMockView';
import {IAccordionCommonViewProps} from '../../../../src/ui/content/Accordion/Accordion';
import AccordionItem from '../../../../src/ui/content/Accordion/AccordionItem';

describe('AccordionItem', () => {
    const defaultProps: IAccordionCommonViewProps = {
        view: AccordionItemMockView,
    };

    function JSXWrapper(additionalProps: IAccordionCommonViewProps | null = null) {
        return (
            <div>
                <AccordionItem
                    {...defaultProps}
                    {...additionalProps}
                />
            </div>
        );
    }

    const expectedAccordionItemClass = 'AccordionItemView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper());
        const accordionItem = container.getElementsByClassName(expectedAccordionItemClass)[0];

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

        const {container, getByText} = render(JSXWrapper(
            {
                style: externalStyle,
                theme,
                position,
                className: externalClassName,
                title,
                children: content,
            },
        ));

        const accordionItem = container.getElementsByClassName(expectedAccordionItemClass)[0];
        const accordionIcon = container.getElementsByClassName(`${expectedAccordionItemClass}__icon`)[0];
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
        const {container} = render(JSXWrapper(
            {
                icon: 'info',
            },
        ));

        const accordionIcon = container.getElementsByClassName('IconView')[0];
        expect(accordionIcon).toBeInTheDocument();
    });
});

//TODO Action
