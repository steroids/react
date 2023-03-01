import * as React from 'react';
import {useBem} from '../../../../src/hooks';
import {IAccordionCommonViewProps} from '../../../../src/ui/content/Accordion/Accordion';

export default function AccordionView(props: IAccordionCommonViewProps) {
    const bem = useBem('AccordionView');
    return (
        <div className={bem(bem.block(), props.className)}>
            {props.children}
        </div>
    );
}
