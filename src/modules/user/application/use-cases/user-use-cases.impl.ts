import { Model } from "mongoose";
import { User } from "../../domain/entities/user.entity";
import { Status } from "../../domain/enums/status.enum";
import { UserRepositoryOutPort } from "../../domain/ports/out/user-repository-out.port";
import { UserDocument, UserSchema } from "../../infraestructure/adapters/out/persistence/entities/user.schema";
import { UserMapper } from "../../infraestructure/adapters/out/persistence/mappers/user.mapper";
import { UserRepository } from "../../infraestructure/adapters/out/persistence/repositories/user.repository";
import { InjectModel } from "@nestjs/mongoose";


export class UserUseCasesImpl implements UserRepositoryOutPort {

    constructor(
        private userRepository: UserRepository,
        private userMapper: UserMapper,
        @InjectModel(User.name)
        private userModel: Model<UserDocument>
    ){}

    async create(user: User): Promise<User> {
        const userDocument: Partial<UserSchema> = {
            username: user.username,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            description: user.description,
            birthDate: user.birthDate,
            interests: user.interests as any,
            profilePicURL: user.profilePicURL,
            lastTimeConnected: new Date(),
            semester: user.semester,
            isOnline: true,
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            freeTimeSchedule: user.freeTimeSchedule,
            status: Status.ACTIVE,
            program: user.program
        }

        const savedDocument = await this.userModel.create(userDocument);

        return this.userMapper.toDomain(savedDocument);
    }

    async update(id: string, user: User): Promise<User> {

        const actualUser = await this.userRepository.findById(id);

        if(!actualUser) throw new Error('User with id ${id} not found');

        actualUser.username = user.username;
        actualUser.name = user.name;
        actualUser.lastname = user.lastname;
        actualUser.description = user.description;
        actualUser.interests = user.interests;
        actualUser.profilePicURL = user.profilePicURL;
        actualUser.lastTimeConnected = new Date();
        actualUser.semester = user.semester;
        actualUser.isOnline = user.isOnline;
        actualUser.isVerified = user.isVerified;
        actualUser.updatedAt = new Date();
        actualUser.freeTimeSchedule = user.freeTimeSchedule;
        actualUser.status = user.status;
        actualUser.program = user.program; // What happen if a user is enrolled in 2 programs?

        const updatedDocument = this.userMapper.toDocument(actualUser);

        const savedDocument = await this.userModel.findByIdAndUpdate(id, updatedDocument, {new: true}).exec();

        if(!savedDocument){
            throw new Error('The update was not succesful')
        }

        return this.userMapper.toDomain(savedDocument);
    }
    
    async deleteById(id: string): Promise<void> {
        
        const actualUser = await this.userRepository.findById(id);

        if(!actualUser) throw new Error('User with id ${id} not found');

        await this.userModel.findByIdAndDelete(id);
        return Promise.resolve();
    }

    async getById(id: string): Promise<User> {

        const actualUser = await this.userRepository.findById(id);

        if(!actualUser) throw new Error('User with id ${id} not found');

        return actualUser;
    }

    async getAll(): Promise<User[]> {

        return await this.userRepository.findAll();
        
    }


}