import {useComponents} from '../../../hooks';
import {IAccordionCommonProps, IAccordionCommonViewProps} from './Accordion';

function AccordionItem(props: IAccordionCommonProps) {
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
} as IAccordionCommonViewProps;

export default AccordionItem;
