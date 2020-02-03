import Crud from './Crud';

interface ICrudGeneratorProps {
  componentProps?: any,
  path?: any,
  items?: any,
}

export {Crud};
export const generatePagesCrud = (id, props = {} as ICrudGeneratorProps) => ({
    component: Crud,
    exact: true,
    ...props,
    id,
    componentProps: {
        baseRouteId: id,
        ...props.componentProps
    },
    items: [].concat(props.items || []).concat([
        {
            component: Crud,
            exact: true,
            isNavVisible: false,
            ...props,
            id: id + '_create',
            path: props.path + '/create',
            componentProps: {
                baseRouteId: id,
                ...props.componentProps
            }
        },
        {
            component: Crud,
            fetch: ({params}) => ({
                url: `${props.componentProps.restUrl}/${params.id}`,
                key: 'item'
            }),
            isNavVisible: false,
            ...props,
            id: id + '_update',
            path: props.path + '/:id/update',
            componentProps: {
                baseRouteId: id,
                ...props.componentProps
            }
        },
        {
            component: Crud,
            isNavVisible: false,
            ...props,
            id: id + '_view',
            path: props.path + '/:id/view',
            componentProps: {
                baseRouteId: id,
                ...props.componentProps
            }
        }
    ])
});
