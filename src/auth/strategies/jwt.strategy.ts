import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";

import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payloas.interface";
import { envs } from "src/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    private readonly logger = new Logger('Strategy');

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){
       super({
            secretOrKey: envs.jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
       })
    }

    async validate(payload: JwtPayload): Promise<User>{
        
        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id });
        
        if (!user){
            throw new UnauthorizedException('Token not valid');
        }

        if(!user.isActive){
            throw new UnauthorizedException('User is not active');
        }
        
        return user;
    }
}