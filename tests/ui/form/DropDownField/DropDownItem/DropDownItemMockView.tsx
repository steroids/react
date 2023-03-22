import React from 'react';
import {CheckboxField, RadioListField} from '../../../../../src/ui/form';
import {ContentType, IDropDownFieldProps} from '../../../../../src/ui/form/DropDownField/DropDownField';
import Icon from '../../../../../src/ui/content/Icon';
import {useBem} from '../../../../../src/hooks';
import IconMockView from '../../../content/Icon/IconMockView';

type PrimaryKey = string | number;

interface IDropDownItemViewProps extends Pick<IDropDownFieldProps, 'contentProperties'> {
    item: {
        id: number,
        label: string,
        contentType?: 'checkbox' | 'radio' | 'dropdown' | 'icon' | 'img',
        contentSrc?: 'string' | React.ReactElement,
    },
    primaryKey?: string,
    hoveredId?: string,
    selectedIds?: (PrimaryKey | any)[];
    onItemSelect?: (id: PrimaryKey | any) => void,
    onItemHover?: (id: PrimaryKey | any) => void,
    groupAttribute?: string;
    level?: number;
}

export default function DropDownItemView(props: IDropDownItemViewProps) {
    const bem = useBem('DropDownItemView');

    const commonProps = {
        className:
            bem.element('option', {
                hover: props.primaryKey && props.hoveredId === props.item[props.primaryKey],
                select: props.primaryKey && props.selectedIds && props.selectedIds.includes(props.item[props.primaryKey]),
                level: !!props.level,
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
            e.preventDefault();
            if (props.onItemSelect && props.primaryKey) {
                props.onItemSelect(props.item[props.primaryKey]);
            }
        },

    };

    const renderTypeCases = (type: ContentType, src: string | React.ReactElement) => {
        switch (type) {
            case 'icon':
                return (
                    <div {...commonProps}>
                        {typeof src === 'string' ? (
                            <Icon
                                view={IconMockView}
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
                            className={bem.element('radio')}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    if (props.item.contentType) {
        return renderTypeCases(props.item.contentType, props.item.contentSrc as string | React.ReactElement);
    }

    if (props.contentProperties) {
        return renderTypeCases(props.contentProperties.type, props.contentProperties.src as string | React.ReactElement);
    }

    return (
        <div {...commonProps}>
            {props.item.label}
        </div>
    );
}
