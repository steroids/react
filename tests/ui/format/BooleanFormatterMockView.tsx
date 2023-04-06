import {IBooleanFormatterPropsView} from '../../../src/ui/format/BooleanFormatter/BooleanFormatter';

export default function BooleanFormatterView(props: IBooleanFormatterPropsView) {
    return props.value ? __('Да') : __('Нет');
}
