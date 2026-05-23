export class ConnectionQueryResponse {
  constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly connection?: any,
    public readonly connections?: any[],
  ) {}
}