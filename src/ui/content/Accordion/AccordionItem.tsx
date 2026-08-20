import {IAccordionItemProps, IAccordionItemViewProps} from './Accordion';
import {useComponents} from '../../../hooks';

const defaultProps = {
    title: 'Accordion',
    positionStyle: 'top',
    theme: 'light',
    showIcon: true,
} as IAccordionItemViewProps;

export default function AccordionItem(receivedProps: IAccordionItemProps) {
    const props = {
        ...defaultProps,
        ...receivedProps,
    };
    const components = useComponents();

    return components.ui.renderView(props.view || 'content.AccordionItemView', props);
}
