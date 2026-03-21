export interface DeleteInterestUseCase {
  deleteInterestById(id: string): Promise<void>;
}
