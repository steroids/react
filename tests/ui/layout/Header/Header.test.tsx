import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import Header, {IHeaderProps} from '../../../../src/ui/layout/Header/Header';
import {JSXWrapper, getElementByClassName} from '../../../helpers';
import HeaderMockView from './HeaderMockView';

describe('Header test', () => {
    const expectedHeaderClassName = 'HeaderView';
    const externalStyle = {width: '30px'};
    const externalClass = 'external-class';
    const expectedAuthButtonLabel = 'Войти';

    const navItems = [
        {
            id: 1,
            label: 'О нас',
        },
        {
            id: 2,
            label: 'Услуги',
        },
        {
            id: 3,
            label: 'Контакты',
            disabled: true,
        },
    ];

    const props: IHeaderProps = {
        view: HeaderMockView,
        logo: {icon: 'kozhinDev', title: 'KozhinDev'},
        nav: {
            items: navItems,
        },
    };

    it('should be in the document ', () => {
        const {container} = render(JSXWrapper<IHeaderProps>(Header, {
            ...props,
        }));

        const header = getElementByClassName(container, expectedHeaderClassName);

        expect(header).toBeInTheDocument();
    });

    it('should have external styles and className', () => {
        const {container} = render(JSXWrapper<IHeaderProps>(Header, {
            ...props,
            style: externalStyle,
            className: externalClass,
        }));

        const header = getElementByClassName(container, expectedHeaderClassName);

        expect(header).toHaveClass(externalClass);
        expect(header).toHaveStyle(externalStyle);
    });

    it('should have correct sizes on all children elements', () => {
        const expectedButtonClassName = 'ButtonView';
        const expectedNavClassName = 'NavBarView';

        const {container} = render(JSXWrapper(Header, {
            ...props,
            size: 'lg',
        }));

        const buttons = container.querySelectorAll(`.${expectedButtonClassName}`);
        const navs = container.querySelectorAll(`.${expectedNavClassName}`);

        buttons.forEach(button => expect(button).toHaveClass(`${expectedButtonClassName}_size_lg`));
        navs.forEach(nav => expect(nav).toHaveClass(`${expectedNavClassName}_size_lg`));
    });

    it('should have logo', () => {
        const {container} = render(JSXWrapper(Header, props));

        const logoTitle = getElementByClassName(container, `${expectedHeaderClassName}__logo-title`);
        const logoImage = getElementByClassName(container, `${expectedHeaderClassName}__logo-image`);

        expect(logoTitle).toBeInTheDocument();
        expect(logoImage).toBeInTheDocument();
    });

    it('should have navs', () => {
        const {getByText} = render(JSXWrapper(Header, props));

        navItems.forEach(item => {
            const nav = getByText(item.label);
            expect(nav).toBeInTheDocument();
        });
    });

    it('should have auth button', () => {
        const {getByText} = render(JSXWrapper(Header, {
            ...props,
            authParams: {
                isAuth: true,
                toRoute: 'root',
            },
        }));
        const authButton = getByText(expectedAuthButtonLabel);
        expect(authButton).toBeInTheDocument();
    });

    it('should have user data', () => {
        const expectedAvatarClassName = 'AvatarView';

        const user = {
            name: 'test',
            avatar: {
                title: 'K D',
            },
            menu: {
                items: [
                    {label: 'Профиль', icon: 'user', onClick: () => { }},
                    {label: 'Настройки', icon: 'setting_line', onClick: () => { }},
                    {label: 'Выйти', icon: 'menu_left', onClick: () => { }},
                ],
                dropDownProps: {
                    position: 'bottom',
                    closeMode: 'click-any',
                },
            },
        };

        const {container, getByText} = render(JSXWrapper(Header, {
            ...props,
            user,
        }));

        const userName = getByText(user.name);
        const avatar = getElementByClassName(container, expectedAvatarClassName);

        expect(userName).toBeInTheDocument();
        expect(avatar).toBeInTheDocument();
    });
});
