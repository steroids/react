import {useMemo} from 'react';
import {useComponents} from '../../../hooks';
import {IAccordionItemViewProps} from './Accordion';

function AccordionItem(props: IAccordionItemViewProps) {
    const components = useComponents();

    const viewProps = useMemo(() => ({
        disabled: props.disabled,
        icon: props.icon,
        hasOneOpenItem: props.hasOneOpenItem,
        title: props.title,
        theme: props.theme,
        activeKey: props.activeKey,
        onChange: props.onChange,
        position: props.position,
        showIcon: props.showIcon,
        toggleCollapse: props.toggleCollapse,
        toggleAccordion: props.toggleAccordion,
        childIndex: props.childIndex,
        isShowMore: props.isShowMore,
        className: props.className,
        style: props.style,
        children: props.children,
    }), [props.activeKey, props.childIndex, props.children, props.className, props.disabled,
        props.hasOneOpenItem, props.icon, props.isShowMore, props.onChange, props.position, props.showIcon,
        props.style, props.theme, props.title, props.toggleAccordion, props.toggleCollapse]);

    return components.ui.renderView(props.view || 'content.AccordionItemView', viewProps);
}

AccordionItem.defaultProps = {
    title: 'Accordion',
    positionStyle: 'top',
    theme: 'light',
    showIcon: true,
} as IAccordionItemViewProps;

export default AccordionItem;
