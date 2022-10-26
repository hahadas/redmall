interface Config {
    url: string;
    debug?: boolean;
    params?: number | string | object;
    isSendHeart?: boolean;
    isReconnection?: boolean;
    reConnectTime?: number;
    timeout?: number;
    heartData?: string | object;
    onSocketMessage?: any;
    onSocketClose?: any;
    onSocketError?: any;
    onSocketOpen?: any;
}
export default class uniSocket {
    config: Config;
    initSocket: any;
    sendSocketMessage: any;
    closeSocket: any;
    constructor(config: Config);
    _reConnectSocket(): void;
    _clearHeart(): void;
    _startHeart(): void;
    _isJson(str: string): boolean;
}
export {};
