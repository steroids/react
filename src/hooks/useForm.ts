import {useContext, useMemo} from 'react';
import {FormContext} from '../ui/form/Form/Form';

export default function useForm() {
    const context = useContext(FormContext);

    return useMemo(() => (context
        ? {
            formId: context.formId,
            model: context.model,
            prefix: context.prefix,
            layout: context.layout,
            formDispatch: context?.dispatch,
            formSelector: (selector: (state, setValue) => any) => context?.provider?.select(context.formId, selector),
        }
        : null
    ), [context]);
}
