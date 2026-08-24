import {useEffect} from 'react';

import {useBem} from '../../../../src/hooks';
import Icon from '../../../../src/ui/content/Icon';
import {ITextFieldViewProps} from '../../../../src/ui/form/TextField/TextField';

export default function TextFieldView(props: ITextFieldViewProps) {
    const bem = useBem('TextFieldView');

    /*
    В хуке устанавливается высота текстового поля, равная высоте введенного текста
    */
    useEffect(() => {
        if (props.autoHeight) {
            const inputElement = props.inputProps.ref.current;

            if (!inputElement) {
                return;
            }

            const inputElementComputedStyles = window.getComputedStyle(inputElement);

            // Получаем числовое значение ширины верхней и нижней границ
            const borderTopWidth = parseInt(inputElementComputedStyles.borderTopWidth, 10);
            const borderBottomWidth = parseInt(inputElementComputedStyles.borderBottomWidth, 10);

            /**
             * Сброс высоты до значения по умолчанию.
             * Необходимо для корректного расчета текущей высоты содержимого:
             * - если текст из поля убирают, высота поля уменьшится до минимально установленного значения
             * - если текст добавляют, высота подстроится под высоту текущего контента
             */
            inputElement.style.height = 'auto';
            inputElement.style.height = `${inputElement.scrollHeight + borderTopWidth + borderBottomWidth}px`;
        }
    }, [props.inputProps.ref, props.inputProps.value, props.autoHeight]);

    return (
        <div className={bem(
            bem.block({
                hasErrors: !!props.errors,
                filled: !!props.inputProps.value,
                size: props.size,
            }),
            props.className,
        )}
        >
            <textarea
                className={bem.element('textarea')}
                id={props.id}
                {...props.inputProps}
            />
            {props.showClear && (
                <Icon
                    className={bem.element('clear')}
                    name='cross_8x8'
                    onClick={props.onClear}
                />
            )}
        </div>
    );
}
