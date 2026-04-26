export interface GetCompatibilityUseCase {
  getCompatibility(userId: string, otherId: string): Promise<number>;
}
