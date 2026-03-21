import { Controller, Delete, Get, Post, Put, Req } from "@nestjs/common";
import { InterestRequestDTO } from "../dto/request/interest-request.dto";
import { InterestResponseDTO } from "../dto/response/interest-response.dto";
import { InterestService } from "src/contexts/user/application/service/interest.service";
import { InterestDtoMapper } from "../mapper/interest-dto.mapper";


@Controller('/interests')
export class InterestController {
    constructor(
        private interestService: InterestService,
        private interestDtoMapper: InterestDtoMapper
    ) { }

    @Post('')
    async createInterest(@Req() interestRequest: InterestRequestDTO): Promise<InterestRequestDTO> {

        const interest = this.interestDtoMapper.toDomain(interestRequest);
        const createInterest = await this.interestService.createInterest(interest);
        return this.interestDtoMapper.toResponse(createInterest);
    }

    @Put('/{id}')
    async updateInterest(@Req() id: string, @Req() interestRequest: InterestRequestDTO): Promise<InterestResponseDTO> {

        const interest = this.interestDtoMapper.toDomain(interestRequest);
        const updatedInterest = await this.interestService.updateInterest(id, interest);
        return this.interestDtoMapper.toResponse(updatedInterest);
    }

    @Delete('/{id}')
    async deleteInterest(@Req() id: string): Promise<void> {

        this.interestService.deleteInterestById(id);
        return Promise.resolve();
    }

    @Get('/{id}')
    async getInterestById(@Req() id: string): Promise<InterestResponseDTO> {

        const interest = await this.interestService.getInterestById(id);
        return this.interestDtoMapper.toResponse(interest);
    }

    @Get('')
    async getAllInterests(): Promise<InterestResponseDTO[]> {
        const interests = await this.interestService.getAllInterests();
        return this.interestDtoMapper.toResponseList(interests);
    }
}