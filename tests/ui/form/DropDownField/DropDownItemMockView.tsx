import React from 'react';
import useBem from '../../../../src/hooks/useBem';
import Icon from '../../../../src/ui/content/Icon';
import {CheckboxField, RadioListField} from '../../../../src/ui/form';
import {ContentType, IDropDownFieldProps} from '../../../../src/ui/form/DropDownField/DropDownField';
import {IFieldWrapperInputProps} from '../../../../src/ui/form/Field/fieldWrapper';
import {Accordion, AccordionItem} from '../../../../src/ui/content';
import AccordionMockView from '../../content/Accordion/AccordionMockView';
import AccordionItemMockView from '../../content/Accordion/AccordionItemMockView';

type PrimaryKey = string | number;

interface IDropDownItemViewProps extends Pick<IDropDownFieldProps, 'itemsContent'>, Pick<IFieldWrapperInputProps, 'size'> {
    item: {
        id: number,
        label: string,
        contentType?: ContentType,
        contentSrc?: 'string' | React.ReactElement,
    },
    primaryKey?: string,
    hoveredId?: string,
    selectedIds?: (PrimaryKey | any)[];
    onItemSelect?: (id: PrimaryKey | any) => void,
    onItemHover?: (id: PrimaryKey | any) => void,
    groupAttribute?: string;
}

export default function DropDownItemView(props: IDropDownItemViewProps) {
    const bem = useBem('DropDownItemView');

    const commonProps = {
        className:
            bem.element('option', {
                hover: props.primaryKey && props.hoveredId === props.item[props.primaryKey],
                select: props.selectedIds && props.primaryKey && props.selectedIds.includes(props.item[props.primaryKey]),
                size: props.size,
            }),
        onFocus: () => {
            if (props.onItemHover && props.primaryKey) {
                props.onItemHover(props.item[props.primaryKey]);
            }
        },
        onMouseOver: () => {
            if (props.onItemHover && props.primaryKey) {
                props.onItemHover(props.item[props.primaryKey]);
            }
        },
        onClick: (e) => {
            if (props.onItemSelect && props.primaryKey) {
                e.preventDefault();
                props.onItemSelect(props.item[props.primaryKey]);
            }
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
                                alt="flag"
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
                    <Accordion>
                        <AccordionItem
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
                    </Accordion>
                );

            default:
                return null;
        }
    };

    if (props.groupAttribute && Array.isArray(props.item[props.groupAttribute])) {
        return renderTypeCases('group', props.item[props.groupAttribute]);
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
