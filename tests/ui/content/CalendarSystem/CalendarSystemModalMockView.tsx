/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-undef */
import { useMemo } from 'react';
import _omit from 'lodash-es/omit';
import _isEmpty from 'lodash-es/isEmpty';
import Modal from '../../../../src/ui/modal/Modal';
import {
    CalendarSystemModalFields,
    IEventInitialValues,
    ICalendarSystemModalViewProps,
} from '../../../../src/ui/content/CalendarSystem/CalendarSystem';
import {InputField, Form, DropDownField, DateTimeField, TextField} from '../../../../src/ui/form';
import Text from '../../../../src/ui/typography/Text/Text';
import useBem from '../../../../src/hooks/useBem';

export default function CalendarSystemModalView(props: ICalendarSystemModalViewProps) {
    const bem = useBem('CalendarSystemModalView');

    const eventInitialValues: IEventInitialValues = useMemo(() => props.eventInitialValues, [props.eventInitialValues]);

    const callOnEventSubmit = (fields: Record<CalendarSystemModalFields, string>) =>
        eventInitialValues && !props.isCreate ? props.onEventSubmit(fields, eventInitialValues) : props.onEventSubmit(fields);

    return (
        <Modal
            title={props.isCreate ? 'Новое событие' : 'Редактирование события'}
            onClose={props.onClose}
            className={bem.block()}
            shouldCloseOnEsc
            shouldCloseOnOverlayClick
        >
            <Form
                className={bem.element('default-form')}
                onSubmit={(fields) => {
                    callOnEventSubmit(fields);
                    if (props.onClose) {
                        props.onClose();
                    }
                }}
                initialValues={eventInitialValues ?? null}
                submitLabel={props.isCreate ? 'Создать' : 'Сохранить'}
            >
                <div>
                    <Text
                        content="Наименование"
                        className={bem.element('label')}
                    />
                    <InputField
                        attribute='title'
                        required
                        className={bem.element('name-field')}
                    />
                    <DropDownField
                        attribute='eventGroupId'
                        items={props.eventGroups}
                        placeholder='Группа'
                        color="primary"
                        required
                        itemsContent={{
                            type: 'checkbox',
                        }}
                    />
                </div>
                <div>
                    <Text
                        content="Время и дата"
                        className={bem.element('label')}
                    />
                    <DateTimeField
                        attribute='date'
                        required
                    />
                </div>
                <div>
                    <Text
                        content="Описание"
                        className={bem.element('label')}
                    />
                    <TextField
                        attribute='description'
                        required
                    />
                </div>
            </Form>
        </Modal>
    );
}
