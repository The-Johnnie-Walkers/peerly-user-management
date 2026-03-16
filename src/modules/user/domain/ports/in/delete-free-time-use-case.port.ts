
export interface DeleteFreeTimeScheduleUseCase {

    deleteFreeTimeScheduleById(id: string): Promise<void>;

}