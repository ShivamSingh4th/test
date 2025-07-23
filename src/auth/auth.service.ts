import { ForbiddenException, Injectable } from "@nestjs/common";
import { User,Bookmark } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})
export class AuthService{
    constructor(private prisma: PrismaService){}
    async signin(dto: AuthDto){
        try {
            const user = await this.prisma.user.findUnique({
                where:{
                    email: dto.email
                }
            });

            if(!user){
                throw new ForbiddenException('User not found');
            }
            if(await argon.verify(user.password, dto.password)){
                return {msg: 'User Signed in'};
            }else{
                throw new ForbiddenException('Credentials do not match');
            }
            
        }
            
        catch (error) {
            throw error;
        }
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
            return {
                email: user.email,
                name: `${user.firstName ?? ''} ${user.lastName ?? ''}`
            };

        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2002'){
                    throw new ForbiddenException(
                        'Credentials Taken'
                    );
                }
            }
            throw error;
        }
    }
}