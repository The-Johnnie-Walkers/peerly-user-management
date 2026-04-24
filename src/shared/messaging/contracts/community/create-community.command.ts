export interface CreateCommunityCommand {
    name: string;
    description: string;
    interests: string[];
    creatorId: string;
}