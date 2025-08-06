import {IFieldListViewProps} from '../../../../src/ui/form/FieldList/FieldList';
import {useBem} from '../../../../src/hooks';
import {Button} from '../../../../src/ui/form';

export default function FieldListView(props: IFieldListViewProps) {
    const bem = useBem('FieldListView');
    return (
        <div
            className={bem(bem.block({hasAlternatingColors: props.hasAlternatingColors}), props.className)}
            style={props.style}
            ref={props.forwardedRef}
        >
            <table
                className={bem(
                    bem.element('table'),
                    props.tableClassName,
                )}
            >
                <thead>
                    <tr>
                        {props.items.map((field, rowIndex) => (
                            <th
                                key={rowIndex}
                                className={field.headerClassName}
                            >
                                {field.title}
                            </th>
                        ))}
                        {props.showRemove && (
                            // eslint-disable-next-line jsx-a11y/control-has-associated-label
                            <th />
                        )}
                    </tr>
                </thead>
                <tbody>
                    {props.children}
                </tbody>
                {props.showAdd && !props.disabled && (
                    <tfoot>
                        <tr>
                            <td colSpan={props.items.length + 1}>
                                <Button
                                    formId={false}
                                    color='primary'
                                    size='sm'
                                    outline
                                    icon='mockIcon'
                                    className={bem.element('button-add')}
                                    onClick={e => {
                                        e.preventDefault();
                                        props.onAdd();
                                    }}
                                >
                                    {__('Добавить')}
                                </Button>
                            </td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
}
