import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import Card from '../../../../src/ui/content/Card/Card';
import {getElementByClassName, getElementByTag, JSXWrapper} from '../../../helpers';
import CardMockView from './CardMockView';

describe('Card tests', () => {
    const props = {
        view: CardMockView,
        header: {
            avatar: {
                src: 'https://i.ibb.co/T4j2NMQ/20230325210515-1.jpg',
                status: true,
            },
            head: 'Header',
            subhead: 'Header Subhead',
            menu: true,
        },
        cover: 'https://i.ibb.co/1rTqmJD/image-1.jpg',
        footer: {
            head: 'Footer',
            subhead: 'Footer Subhead',
        },
    };

    const expectedCardClassName = 'CardView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(Card, props));
        const card = getElementByClassName(container, expectedCardClassName);
        expect(card).toBeInTheDocument();
    });

    it('should have header', () => {
        const {container, getByText} = render(JSXWrapper(Card, props));

        const header = getElementByClassName(container, `${expectedCardClassName}__header`);
        const avatar = getElementByClassName(container, 'AvatarView');
        const head = getByText(props.header.head);
        const subhead = getByText(props.header.subhead);
        const menu = getElementByClassName(container, `${expectedCardClassName}__header-menu`);

        expect(header).toBeInTheDocument();
        expect(avatar).toBeInTheDocument();
        expect(head).toBeInTheDocument();
        expect(subhead).toBeInTheDocument();
        expect(menu).toBeInTheDocument();
    });

    it('should have footer', () => {
        const {container, getByText} = render(JSXWrapper(Card, props));

        const footer = getElementByClassName(container, `${expectedCardClassName}__footer`);
        const head = getByText(props.footer.head);
        const subhead = getByText(props.footer.subhead);

        expect(footer).toBeInTheDocument();
        expect(head).toBeInTheDocument();
        expect(subhead).toBeInTheDocument();
    });

    it('should have cover', () => {
        const {container} = render(JSXWrapper(Card, props));

        const cover = getElementByClassName(container, `${expectedCardClassName}__cover`);
        const img = container.querySelector(`.${expectedCardClassName}__cover > img`);

        expect(cover).toBeInTheDocument();
        expect(img).toHaveAttribute('src', props.cover);
        expect(img).toHaveAttribute('alt', 'Card cover img');
    });

    it('should have links and buttons', () => {
        const button = {
            outline: true,
            color: 'primary',
            children: 'PRIMARY',
            size: 'sm',
        };

        const link = {
            url: 'https://i.ibb.co/',
            text: 'Link',
        };

        const {container, getByText} = render(JSXWrapper(Card, {
            ...props,
            links: [
                link,
            ],
            buttons: [
                button,
            ],
        }));

        const expectedLinksAndButtonsCount = 2;
        const linksAndButtons = container.querySelectorAll('.ButtonView');
        const linkElement = getElementByClassName(container, 'ButtonView_link');
        const buttonElement = getByText(button.children);

        expect(linksAndButtons.length).toBe(expectedLinksAndButtonsCount);
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', link.url);
        expect(buttonElement).toBeInTheDocument();
    });
});
