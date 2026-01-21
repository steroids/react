import {useBem} from '../../../../src/hooks';
import Modal from '../../../../src/ui/modal/Modal';
import {CalendarSystemEventGroupModalViewProps} from '../../../../src/ui/content/CalendarSystem/CalendarSystem';
import {InputField, Form} from '../../../../src/ui/form';
import {Text} from '../../../../src/ui/typography';

export default function CalendarSystemEventGroupModalView(props: CalendarSystemEventGroupModalViewProps) {
    const bem = useBem('CalendarSystemEventGroupModalView');

    return (
        <Modal
            title={props.isCreate ? 'Новая группа' : 'Редактирование группы'}
            onClose={props.onClose}
            className={bem.block()}
            shouldCloseOnEsc
            shouldCloseOnOverlayClick
        >
            <Form
                className={bem.element('form')}
                onSubmit={(fields) => {
                    props.onEventGroupSubmit(fields);
                    props.onClose();
                }}
                submitLabel={props.isCreate ? 'Создать' : 'Сохранить'}
            >
                <div>
                    <Text
                        className={bem.element('label')}
                        content={__('Имя')}
                    />
                    <InputField
                        attribute='label'
                        required
                        className={bem.element('name-field')}
                    />
                </div>
                <div>
                    <Text
                        className={bem.element('label')}
                        content="Выбор цвета"
                    />
                    <InputField
                        type='color'
                        required
                        attribute='color'
                    />
                </div>
            </Form>
        </Modal>
    );
}
