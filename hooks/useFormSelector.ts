import {useContext} from 'react';
import {providers} from '../utils/form';
import {FormContext} from '../ui/form/Form/Form';

/**
 * Выбор значений формы
 * @param selector
 */
export default function useFormSelector(selector: (state, setValue) => any) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const context = useContext(FormContext);
    if (context) {
        // Redux
        if (context.globalState) {
            return providers.redux.select(context.formId, selector);
        }

        // React Reducer
        return providers.reducer.select(null, selector);
    }

    return null;
}
