import { InterestRequestDTO } from "../dto/request/interest-request.dto";
import { InterestResponseDTO } from "../dto/response/interest-response.dto";
import { Interest } from "src/contexts/user/domain/entities/interest.entity";

export class InterestDtoMapper {

    toDomain(interestRequest: InterestRequestDTO): Interest {
        return new Interest ({
            id: "",
            name: interestRequest.name,
            category: interestRequest.category
        })
    }

    toResponse(interest: Interest): InterestResponseDTO {
        return {
            name: interest.name,
            category: interest.category
        }
    }

    toResponseList(interests: Interest[]): InterestResponseDTO[]{
        return interests.map(interest => (this.toResponse(interest)));
    }
}