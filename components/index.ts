import ClientStorageComponent from './ClientStorageComponent';
import HtmlComponent from './HtmlComponent';
import HttpComponent from './HttpComponent';
import LocaleComponent from './LocaleComponent';
import MetaComponent from './MetaComponent';
import ResourceComponent from './ResourceComponent';
import StoreComponent from './StoreComponent';
import UiComponent from './UiComponent';

export {
    ClientStorageComponent,
    HtmlComponent,
    HttpComponent,
    LocaleComponent,
    MetaComponent,
    ResourceComponent,
    StoreComponent,
    UiComponent,
};

export default {
    clientStorage: {
        className: ClientStorageComponent,
    },
    html: {
        className: HtmlComponent,
    },
    http: {
        className: HttpComponent,
    },
    locale: {
        className: LocaleComponent,
    },
    meta: {
        className: MetaComponent,
    },
    store: {
        className: StoreComponent,
    },
    ui: {
        className: UiComponent,
    },
};
