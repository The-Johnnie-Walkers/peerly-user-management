export interface DeleteUserUseCase {

    deleteUserById(id: string): Promise<void>;

}