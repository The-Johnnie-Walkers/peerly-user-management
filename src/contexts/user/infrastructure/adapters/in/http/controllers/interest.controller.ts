import { Controller, Delete, Get, Post, Put, Req } from "@nestjs/common";
import { UserMapperApplication } from "src/contexts/user/application/mapper/user-mapper.application";
import type { CreateInterestUseCase } from "src/contexts/user/domain/ports/in/create-interest-use-case.port";
import type { DeleteInterestUseCase } from "src/contexts/user/domain/ports/in/delete-interest-use-case.port";
import type { GetAllInterestsUseCase } from "src/contexts/user/domain/ports/in/get-all-interests-use-case.port";
import type { GetInterestUseCase } from "src/contexts/user/domain/ports/in/get-interest-use.case.port";
import type { UpdateInterestUseCase } from "src/contexts/user/domain/ports/in/update-interest-use-case.port";
import { InterestRequestDTO } from "../dto/request/interest-request.dto";
import { InterestResponseDTO } from "../dto/response/interest-response.dto";


@Controller('/interests')
export class InterestController {
    constructor(
        private createInterestUseCase: CreateInterestUseCase,
        private updateInterestUseCase: UpdateInterestUseCase,
        private deleteInterestUseCase: DeleteInterestUseCase,
        private getInterestUseCase: GetInterestUseCase,
        private getAllInterestsUseCase: GetAllInterestsUseCase,
        private userMapper: UserMapperApplication
    ) { }

    @Post('')
    async createInterest(@Req() interestRequest: InterestRequestDTO): Promise<InterestRequestDTO> {

        const interest = this.userMapper.toInterestDomain(interestRequest);
        const createInterest = await this.createInterestUseCase.createInterest(interest);
        return this.userMapper.toInterestResponse(createInterest);
    }

    @Put('/{id}')
    async updateInterest(@Req() id: string, @Req() interestRequest: InterestRequestDTO): Promise<InterestResponseDTO> {

        const interest = this.userMapper.toInterestDomain(interestRequest);
        const updatedInterest = await this.updateInterestUseCase.updateInterest(id, interest);
        return this.userMapper.toInterestResponse(updatedInterest);
    }

    @Delete('/{id}')
    async deleteInterest(@Req() id: string): Promise<void> {

        this.deleteInterestUseCase.deleteInterestById(id);
        return Promise.resolve();
    }

    @Get('/{id}')
    async getInterestById(@Req() id: string): Promise<InterestResponseDTO> {

        const interest = await this.getInterestUseCase.getInterestById(id);
        return this.userMapper.toInterestResponse(interest);
    }

    @Get('')
    async getAllInterests(): Promise<InterestResponseDTO[]> {
        const interests = await this.getAllInterestsUseCase.getAllInterests();
        return this.userMapper.toInterestResponseList(interests);
    }
}