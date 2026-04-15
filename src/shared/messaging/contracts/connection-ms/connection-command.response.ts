export class ConnectionCommandResponse {
    constructor(
        public readonly success: boolean,
        public readonly connectionId: string,
        public readonly message: string,
    ) {}
}