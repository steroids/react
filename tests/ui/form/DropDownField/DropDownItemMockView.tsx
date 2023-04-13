import React from 'react';
import useBem from '../../../../src/hooks/useBem';
import {
    CHECKBOX_CONTENT_TYPE,
    GROUP_CONTENT_TYPE,
    ICON_CONTENT_TYPE,
    IDropDownFieldItemViewProps,
    IMG_CONTENT_TYPE,
    RADIO_CONTENT_TYPE,
} from '../../../../src/ui/form/DropDownField/DropDownField';
import AccordionItemView from '../../content/Accordion/AccordionItemMockView';
import CheckboxFieldView from '../CheckboxField/CheckboxFieldMockView';
import RadioFieldView from '../RadioField/RadioFieldMockView';
import renderIcon from '../../../mocks/renderIconMock';

export default function DropDownItemView(props: IDropDownFieldItemViewProps) {
    const bem = useBem('DropDownItemView');

    const commonProps = {
        className:
            bem.element('option', {
                hover: props.hoveredId === props.item[props.primaryKey],
                select: props.selectedIds.includes(props.item[props.primaryKey]),
                size: props.size,
            }),
        onFocus: () => props.onItemHover(props.item[props.primaryKey]),
        onMouseOver: () => props.onItemHover(props.item[props.primaryKey]),
        onClick: (e) => {
            e.preventDefault();
            props.onItemSelect(props.item[props.primaryKey]);
        },
    };

    switch (props.type) {
        case GROUP_CONTENT_TYPE:
            return (
                <AccordionItemView
                    isShowMore={props.isShowMore}
                    childIndex={props.childIndex}
                    toggleCollapse={props.toggleCollapse}
                    toggleAccordion={() => { }}
                    showIcon
                    title={props.item.label}
                    position="middle"
                    key={props.item[props.primaryKey]}
                    className={
                        bem.element('group', {
                            size: props.size,
                        })
                    }
                >
                    {
                        props.item[props.groupAttribute]?.map((subItem, itemIndex) => (
                            <DropDownItemView
                                {...props}
                                type={subItem.type ? subItem.type : props.itemsContent?.type}
                                key={itemIndex}
                                item={subItem}
                            />
                        ))
                    }
                </AccordionItemView>
            );

        case ICON_CONTENT_TYPE:
            return (
                <div
                    {...commonProps}
                    key={props.item[props.primaryKey]}
                >
                    {renderIcon(props.item.contentSrc, {className: bem.element('icon')})}
                    <span>
                        {props.item.label}
                    </span>
                </div>
            );

        case CHECKBOX_CONTENT_TYPE:
            return (
                <div
                    {...commonProps}
                    key={props.item[props.primaryKey]}
                >
                    <CheckboxFieldView
                        label={props.item.label}
                        className={bem.element('checkbox')}
                        size={props.size}
                        inputProps={{
                            disabled: false,
                            name: props.item.label,
                            checked: false,
                            onChange: () => { },
                            type: 'checkbox',
                        }}
                        checked={props.selectedIds.includes(props.item[props.primaryKey])}
                    />
                </div>
            );

        case RADIO_CONTENT_TYPE:
            return (
                <div
                    {...commonProps}
                    key={props.item[props.primaryKey]}
                >
                    <RadioFieldView
                        label={props.item.label}
                        className={bem.element('radio', {
                            size: props.size,
                        })}
                        size={props.size}
                        inputProps={{
                            disabled: false,
                            name: props.item.label,
                            checked: false,
                            onChange: () => { },
                            type: 'radio',
                        }}
                        checked={props.selectedIds.includes(props.item[props.primaryKey])}
                    />
                </div>
            );

        case IMG_CONTENT_TYPE:
            return (
                <div
                    {...commonProps}
                    key={props.item[props.primaryKey]}
                >
                    <span className={bem.element('img')}>
                        <img
                            src={props.item.contentSrc as string}
                            alt="custom source for item"
                        />
                    </span>
                    <span>
                        {props.item.label}
                    </span>
                </div>
            );

        default:
            return (
                <div
                    {...commonProps}
                    key={props.item[props.primaryKey]}
                >
                    {props.item.label}
                </div>
            );
    }
}
