export class CommunityQueryResponse {
    constructor(
        public readonly success: boolean,
        public readonly message: string,
        public readonly community?: any,
        public readonly communities?: any[],
    ) {}
}