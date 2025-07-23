import { ForbiddenException, Injectable } from "@nestjs/common";
import { User,Bookmark } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";

@Injectable({})
export class AuthService{
    constructor(private prisma: PrismaService){}
    login(){
        return {message:'Logging in;'};
    }

    async signup(dto: AuthDto){
        try {
            const hashedPass = await argon.hash(dto.password);

            const user = await this.prisma.user.create({
                data:{
                    email: dto.email,
                    password: hashedPass,
                    firstName: dto.firstName,
                    lastName: dto.lastName
                }
            })
            return user;

        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException(
                        'Credentials Taken'
                    );
                }
            }
            throw error;
        }
    }
}