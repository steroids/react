import React, {
    BaseHTMLAttributes,
    LinkHTMLAttributes,
    MetaHTMLAttributes,
    PropsWithChildren,
    ScriptHTMLAttributes,
    StyleHTMLAttributes,
} from 'react';
import Helmet from 'react-helmet';

interface IInnerHTML {
    /**
     * Содержимое тега
     */
    innerHtml?: string
}

interface IScript extends ScriptHTMLAttributes<any>, IInnerHTML {}
interface IStyle extends StyleHTMLAttributes<any>, IInnerHTML {}

/**
 * Meta
 * Компонент используется для ssr и нужен для конфигурации html-тегов в документе.
 */
interface IMetaProps extends PropsWithChildren<any>{
    /**
     * Заголовок документа
     * @example Home page
     */
    title?: string,

    /**
     * Описание документа
     * @example The main page of the site
     */
    description?: string,

    /**
     * Скрипты, которые необходимо разместить на сайте
     * @example [{src: '/lib/SomeLibrary.min.js'}]
     */
    scripts?: IScript[],

    /**
     * Мета-теги
     * @example [{name: 'yandex-verification', content: 'ce...9e6'}]
     */
    meta?: MetaHTMLAttributes<any>[],

    /**
     * Ссылки на ресурсы
     * @example [{href: '/lib/SomeLibrary.css', rel: 'stylesheet', type: 'text/css'}]
     */
    links?: LinkHTMLAttributes<any>[],

    /**
     * Контент для тегов \<style\>
     */
    styles?: IStyle[],

    /**
     * Контент для тегов \<noscript\>
     */
    noScripts?: IInnerHTML[],

    /**
     * Конфигурация тега \<base\>
     */
    base?: BaseHTMLAttributes<any>
}

function Meta(props: IMetaProps) {
    return (
        <Helmet>
            <title>{props.title}</title>
            {props.base && <base {...props.base} />}
            {props.description && <meta name='description' content={props.description} />}
            {props.meta?.map((attrs, index) => <meta key={index} {...attrs} />)}
            {props.links?.map((attrs, index) => <link key={index} {...attrs} />)}
            {props.styles?.map((attrs, index) => (
                <style
                    key={index}
                    {...attrs}
                    dangerouslySetInnerHTML={{
                        __html: attrs.innerHtml,
                    }}
                />
            ))}
            {props.scripts?.map((attrs, index) => (
                <script
                    key={index}
                    {...attrs}
                    dangerouslySetInnerHTML={{
                        __html: attrs.innerHtml,
                    }}
                />
            ))}
            {props.noScripts?.map((attrs, index) => (
                <noscript
                    key={index}
                    dangerouslySetInnerHTML={{
                        __html: attrs.innerHtml,
                    }}
                />
            ))}
            {props.children}
        </Helmet>
    );
}

export default Meta;
