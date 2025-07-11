import { useCallback } from 'react';
import {IBreadcrumbsViewProps} from '../../../../src/ui/nav/Breadcrumbs/Breadcrumbs';
import Link from '../../../../src/ui/nav/Link';
import {useBem} from '../../../../src/hooks';
import {Icon} from '../../../../src/ui/content';
import IconMockView from '../../content/Icon/IconMockView';
import renderIconMock from '../../../mocks/renderIconMock';

export default function BreadcrumbsView(props: IBreadcrumbsViewProps) {
    const bem = useBem('BreadcrumbsView');
    const items = props.items || [];

    const renderLink = useCallback((item, children) => (
        <Link
            toRoute={item.id}
            toRouteParams={props.routeParams}
            href={item.id}
        >
            {children}
        </Link>
    ), [props.routeParams]);

    const renderHomeIcon = useCallback(() => (
        props.customIcon
            ? renderIconMock(props.customIcon, {className: bem.element('custom-icon')})
            : (
                <Icon
                    view={IconMockView}
                    name='mockIcon'
                    className={bem.element('icon')}
                />
            )
    ), [bem, props.customIcon]);

    return (
        <nav
            className={bem(bem.block(), props.className)}
            aria-label='breadcrumb'
        >
            <ol className={bem.element('list')}>
                {items.map((item, index) => {
                    const isLastItem = items.length === index + 1;
                    const isFirstItem = index === 0;
                    return (
                        <li
                            key={item.id || index}
                            className={bem.element('item')}
                        >
                            {isFirstItem && item.id && renderLink(
                                item,
                                props.showIcon ? renderHomeIcon() : item.title,
                            )}
                            {!isFirstItem && !isLastItem && item.id && renderLink(
                                item,
                                item.title,
                            )}
                            {(isLastItem || !item.id) && (
                                <span>
                                    {props.pageTitle || item.title}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
