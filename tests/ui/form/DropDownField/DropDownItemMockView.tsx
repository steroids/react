import React from 'react';
import useBem from '../../../../src/hooks/useBem';
import Icon from '../../../../src/ui/content/Icon';
import {CheckboxField, RadioListField} from '../../../../src/ui/form';
import {ContentType, IDropDownItemViewProps} from '../../../../src/ui/form/DropDownField/DropDownField';
import {AccordionItem} from '../../../../src/ui/content';
import {IAccordionCommonViewProps} from '../../../../src/ui/content/Accordion/Accordion';

const GROUP_CONTENT_TYPE = 'group';

export default function DropDownItemView(props: IDropDownItemViewProps) {
    const bem = useBem('DropDownItemView');

    const groupProps = props as IAccordionCommonViewProps;

    const commonProps = {
        className:
            bem.element('option', {
                hover: props.primaryKey && props.hoveredId === props.item[props.primaryKey],
                select: props.selectedIds && props.primaryKey && props.selectedIds.includes(props.item[props.primaryKey]),
                size: props.size,
            }),
        onFocus: () => {
            props.onItemHover(props.item[props.primaryKey]);
        },
        onMouseOver: () => {
            props.onItemHover(props.item[props.primaryKey]);
        },
        onClick: (e) => {
            e.preventDefault();
            props.onItemSelect(props.item[props.primaryKey]);
        },

    };

    const renderTypeCases = (type: ContentType | 'group', src: string | React.ReactElement | null) => {
        switch (type) {
            case 'icon':
                return (
                    <div {...commonProps}>
                        {typeof src === 'string' ? (
                            <Icon
                                name={src}
                                className={bem.element('icon')}
                            />
                        ) : (
                            <span className={bem.element('icon')}>
                                {src}
                            </span>
                        )}
                        <span>
                            {props.item.label}
                        </span>
                    </div>
                );

            case 'checkbox':
                return (
                    <div {...commonProps}>
                        <CheckboxField
                            label={props.item.label}
                            className={bem.element('checkbox')}
                            size={props.size}
                            inputProps={{
                                checked: props.selectedIds && props.primaryKey && props.selectedIds.includes(props.item[props.primaryKey]),
                            }}
                        />
                    </div>
                );

            case 'img':
                return (
                    <div {...commonProps}>
                        <span className={bem.element('img')}>
                            <img
                                src={src as string}
                                alt="custom source for item"
                            />
                        </span>
                        <span>
                            {props.item.label}
                        </span>
                    </div>
                );

            case 'radio':
                return (
                    <div {...commonProps}>
                        <RadioListField
                            items={[props.item]}
                            selectedIds={props.selectedIds}
                            className={bem.element('radio', {
                                size: props.size,
                            })}
                            size={props.size}
                        />
                    </div>
                );

            case 'group':
                return (
                    <AccordionItem
                        childIndex={groupProps.childIndex}
                        isShowMore={groupProps.isShowMore}
                        toggleAccordion={groupProps.toggleAccordion}
                        toggleCollapse={groupProps.toggleCollapse}
                        title={props.item.label}
                        position="middle"
                        className={bem.element('group', {
                            size: props.size,
                        })}
                    >
                        {props.groupAttribute && props.item[props.groupAttribute].map((subItem, itemIndex) => (
                            <DropDownItemView
                                {...props}
                                key={itemIndex}
                                item={subItem}
                            />
                        ))}
                    </AccordionItem>
                );

            default:
                return null;
        }
    };

    if (props.groupAttribute && Array.isArray(props.item[props.groupAttribute])) {
        return renderTypeCases(GROUP_CONTENT_TYPE, props.item[props.groupAttribute]);
    }

    if (props.item.contentType) {
        return renderTypeCases(props.item.contentType, props.item.contentSrc || null);
    }

    if (props.itemsContent) {
        return renderTypeCases(props.itemsContent.type, props.itemsContent.src || null);
    }

    return (
        <div {...commonProps}>
            {props.item.label}
        </div>
    );
}
