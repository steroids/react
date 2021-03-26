import {useContext} from 'react';
import {FormContext} from '../ui/form/Form/Form';

/**
 * Выбор значений формы
 * @param selector
 */
export default function useFormSelector(selector: (state, setValue) => any) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const context = useContext(FormContext);
    return context.provider
        ? context.provider.select(context.formId, selector)
        : null;
}
