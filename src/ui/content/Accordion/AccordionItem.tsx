import {useComponents} from '../../../hooks';
import {IAccordionItemProps, IAccordionItemViewProps} from './Accordion';

function AccordionItem(props: IAccordionItemProps) {
    const components = useComponents();
    return components.ui.renderView(props.view || 'content.AccordionItemView', {
        ...props,
    });
}

AccordionItem.defaultProps = {
    title: 'Accordion',
    positionStyle: 'top',
    theme: 'light',
    showIcon: true,
} as IAccordionItemViewProps;

export default AccordionItem;
