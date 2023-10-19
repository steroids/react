/**
 * Web Socket Component
 * Компонент, обеспечивающий постоянное web-socket соединение с сервером. Поддерживает подписку на каналы, обработку
 * ответов и токен авторизации
 */
import {IComponents} from '../providers/ComponentsProvider';

type TStream = string | [string, string|number[]];

export interface IWebSocketComponentConfig {
    /**
     * url для websocket
     */
    wsUrl: string;

    /**
     * Массив streams
     */
    streams: TStream[];

    /**
     * Хендлер для авторизации
     */
    authHandler: (components: IComponents) => Promise<string>;

    /**
     * Функция, которая вызывается на открытие соединения
     */
    onOpen: (event: any, components: IComponents) => any;

    /**
     * Функция, которая вызывается на закрытие соединения
     */
    onClose: (event: any, components: IComponents) => any;

    /**
     * Функция, которая вызывается на отправку сообщения
     */
    onMessage: (data: Record<string, unknown>, components: IComponents) => any;
}

export interface IWebSocketComponent extends IWebSocketComponentConfig{
    /**
     * Открытие websocket соединения
     */
    open(closePrevious?: boolean): void;

    /**
     * Закрытие websocket соединения
     */
    close(): void;

    /**
     * Подписка на stream
     */
    subscribeStream(stream: TStream, id: string | number): void;

    /**
     * Подписка на streams
     */
    subscribe(streams: TStream[]): void;

    /**
     * Отписка от stream
     */
    unsubscribeStream(stream: TStream, id: string | number): void;

    /**
     * Отписка от streams
     */
    unsubscribe(streams: TStream[]): void;
}

const getStreamName = stream => Array.isArray(stream) ? stream[0] : stream;

export default class WebSocketComponent implements IWebSocketComponent {
    wsUrl: string;

    streams: TStream[];

    authHandler: (components: IComponents) => Promise<string>;

    onOpen: (event: any, components: IComponents) => any;

    onClose: (event: any, components: IComponents) => any;

    onMessage: (data: Record<string, unknown>, components: IComponents) => any;

    _components: IComponents;

    _connection: any;

    _tryCount: any;

    _authToken: any;

    REASON_CODE_UNAUTHORIZED: number;

    constructor(components, config) {
        this.wsUrl = config.wsUrl || null;
        this.streams = config.streams || ['*'];
        this.authHandler = config.authHandler || null;
        this.onOpen = config.onOpen || null;
        this.onClose = config.onClose || null;
        this.onMessage = config.onMessage || null;

        this._components = components;
        this._connection = null;
        this._tryCount = null;
        this._authToken = null;

        this._connect = this._connect.bind(this);
        this._onOpen = this._onOpen.bind(this);
        this._onMessage = this._onMessage.bind(this);
        this._onClose = this._onClose.bind(this);

        this.REASON_CODE_UNAUTHORIZED = 4401;
    }

    open(closePrevious = false) {
        if (closePrevious) {
            this.close();
        }
        if (!this._connection) {
            this._connect();
        }
    }

    close() {
        if (this._connection) {
            this._connection.close();
            this._connection = null;
        }
    }

    subscribeStream(stream, id) {
        if (id) {
            this.subscribe([[stream, [id]]]);
        } else {
            this.subscribe([stream]);
        }
    }

    subscribe(streams) {
        if (!this._connection) {
            return;
        }
        streams = [].concat(streams);

        // Стримы для подписки
        const forSubscribe = [];
        streams.forEach(stream => {
            // Если стримов нет, то сразу добавляем
            if (this.streams.length === 0) {
                this.streams.push(stream);
                forSubscribe.push(stream);
                return;
            }

            const name = getStreamName(stream);
            // Перебираем текущие стримы
            this.streams.forEach((clientStream, index, clientStreams) => {
                // Если текущий стрим и запрашиваемый вида [streamName, [ids...]]
                // то из запрашиваемых id выбираем те, на которые не подписаны,
                // формируем новый стрим с нужными id, добавляем с список для дальнейшей подписки
                if (getStreamName(clientStream) === name && Array.isArray(clientStream)
                    && Array.isArray(stream)
                ) {
                    const idsForSubscribe = stream[1].filter(id => !clientStream.includes(id));
                    forSubscribe.push([name, idsForSubscribe]);
                    // К текущим стримам добавлем недостающие id
                    clientStreams[index][1] = clientStreams[index][1].concat(idsForSubscribe);
                } else {
                    forSubscribe.push(stream);
                }
            });
        });

        // Если есть стримы, на которые нужно подписаться, шлем серверу
        if (forSubscribe.length > 0) {
            this._connection.send(JSON.stringify({
                action: 'subscribe',
                data: forSubscribe,
            }));
        }
    }

    unsubscribeStream(stream, id) {
        this.unsubscribe(id ? [[stream, [id]]] : [stream]);
    }

    unsubscribe(streams) {
        if (!this._connection || this.streams.length === 0) {
            return;
        }
        streams = [].concat(streams);

        // Стримы для отписки
        const forUnsubscribe = [];
        this.streams.forEach((clientStream, index, clientStreams) => {
            const name = getStreamName(clientStream);
            streams.forEach(stream => {
                if (getStreamName(stream) === name) {
                    // Если подписаны на стрим вида 'stream', а запрос на отписку
                    // виду ['stream', [ids...]], ничего не делаем
                    if (typeof clientStream === 'string' && Array.isArray(stream)) {
                        return;
                    }

                    // Если обычный стрим, добавляем в список для отписки и удаляем из своего списка
                    if (typeof stream === 'string') {
                        forUnsubscribe.push(clientStream);
                        clientStreams.splice(index, 1);

                        // Если стримы вида ['stream', [ids...]], находим из запрашиваемых выбираем ids,
                        // на которые уже подписаны
                        // Формируем новый стрим и добавляем в список для дальнейшей отписки
                        // Удаляем эти ids из текущего списка
                    } else if (Array.isArray(stream) && Array.isArray(clientStream)) {
                        const idsForUnsubscribe = stream[1].filter(streamId => clientStream[1].includes(streamId));
                        forUnsubscribe.push([name, idsForUnsubscribe]);
                        clientStreams[index][1] = clientStreams[index][1].filter(id => !idsForUnsubscribe.includes(id));
                        // Если удалили все ids, то удаляем стрим целиком
                        if (clientStreams[index][1].length === 0) {
                            clientStreams.splice(index, 1);
                        }
                    }
                }
            });
        });

        // Если есть стримы, от которых нужно отписаться, шлем серверу
        if (forUnsubscribe.length > 0) {
            this._connection.send(JSON.stringify({
                action: 'unsubscribe',
                data: forUnsubscribe,
            }));
        }
    }

    private async _connect() {
        if (!this._authToken) {
            const token = await this.authHandler(this._components);
            if (token) {
                this._authToken = token;
                this._connect();
            }
        } else if (this.streams) {
            this._connection = new WebSocket(
                this.wsUrl + '?streams=' + this.streams.join(',') + '&token=' + this._authToken,
            );
            this._connection.onopen = this._onOpen;
            this._connection.onmessage = this._onMessage;
            this._connection.onclose = this._onClose;
        }
    }

    private _reConnect() {
        let delay = 1000;
        if (this._tryCount > 10) {
            delay = 2000;
        }
        if (this._tryCount > 50) {
            delay = 5000;
        }
        if (this._tryCount > 100) {
            delay = 15000;
        }

        this._tryCount += 1;
        setTimeout(this._connect, delay);
    }

    private _onOpen(event) {
        this._tryCount = 0;

        if (this.onOpen) {
            this.onOpen(event, this._components);
        }
    }

    private _onMessage(message) {
        if (this.onMessage) {
            this.onMessage(JSON.parse(message.data), this._components);
        }
    }

    private _onClose(event) {
        if (this.onClose) {
            this.onClose(event, this._components);
        }

        if (event.code === this.REASON_CODE_UNAUTHORIZED) {
            this._authToken = null;
        }
        this._reConnect();
    }
}
