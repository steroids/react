import Form from '../../src/ui/form/Form';

export function FormWrapper<PropsType>(
    Component: any,
    props: PropsType,
) {
    return (
        <Form>
            <Component
                {...props}
            />
        </Form>
    );
}
