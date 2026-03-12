import useSelector from './useSelector';
import {getRoute, getRouteParams, buildUrl} from '../reducers/router';

export default function useAppLanguage() {
    const route = useSelector(getRoute);
    const routeParams = useSelector(getRouteParams);

    // Build URL for the new language and load this page
    const setLanguage = (newLanguage) => {
        if (routeParams.language !== newLanguage) {
            window.location.href = buildUrl(route.path, {
                ...routeParams,
                language: newLanguage,
            });
        }
    };
    return {
setLanguage,
};
}
