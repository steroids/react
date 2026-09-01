import {IAccordionItemProps} from './Accordion';
import {useComponents} from '../../../hooks';

const defaultProps: IAccordionItemProps = {
    title: 'Accordion',
    position: 'top',
    theme: 'light',
    showIcon: true,
};

export default function AccordionItem(receivedProps: IAccordionItemProps) {
    const props = {
        ...defaultProps,
        ...receivedProps,
    };
    const components = useComponents();

    return components.ui.renderView(props.view || 'content.AccordionItemView', props);
}
