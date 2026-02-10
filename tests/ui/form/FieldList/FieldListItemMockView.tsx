import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import {Icon} from '../../../../src/ui/content';
import {Field} from '../../../../src/ui/form';
import {IFieldListItemViewProps} from '../../../../src/ui/form/FieldList/FieldList';
import IconMockView from '../../content/Icon/IconMockView';

export default React.memo((props: IFieldListItemViewProps) => {
    const bem = useBem('FieldListItemView');
    return (
        <tr className={bem.block()}>
            {props.items.map((field, index) => (
                <td
                    key={index}
                    className={field.className}
                >
                    <Field
                        {...field}
                        prefix={props.prefix}
                    />
                </td>
            ))}
            {props.showRemove && (
                <td>
                    {(!props.required || props.rowIndex > 0) && (
                        <button
                            type='button'
                            className={bem.element('remove')}
                            onClick={e => {
                                e.preventDefault();
                                props.onRemove(props.rowIndex);
                            }}
                        >
                            <Icon
                                view={IconMockView}
                                name="mockIcon"
                            />
                        </button>
                    )}
                </td>
            )}
        </tr>
    );
});
