import * as React from 'react';
import {IBreadcrumbsViewProps} from '../../../../src/ui/nav/Breadcrumbs/Breadcrumbs';
import {useBem} from '../../../../src/hooks';
import Link from '../../../../src/ui/nav/Link';

export default function BreadcrumbsView(props: IBreadcrumbsViewProps) {
    const bem = useBem('BreadcrumbsView');
    const items = props.items || [];

    return (
        <nav
            className={bem(bem.block(), props.className)}
            aria-label='breadcrumb'
        >
            <ol className={bem.element('list')}>
                {items.map((item, index) => {
                    const isLastItem = items.length === index + 1;
                    return (
                        <li
                            key={item.id || index}
                            className={bem.element('item')}
                        >
                            {!isLastItem && item.id && (
                                <Link
                                    toRoute={item.id}
                                    toRouteParams={props.routeParams}
                                    href={item.id}
                                >
                                    {item.title}
                                </Link>
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
