export class CommunityCommandResponse {
    constructor(
        public readonly success: boolean,
        public readonly communityId: string,
        public readonly message: string,
    ) {}
}