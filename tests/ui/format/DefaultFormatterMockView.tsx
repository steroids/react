import {IBooleanFormatterPropsView} from '../../../src/ui/format/BooleanFormatter/BooleanFormatter';

export default function DefaultFormatterView(props: IBooleanFormatterPropsView) {
    return props.value || props.children || null;
}
