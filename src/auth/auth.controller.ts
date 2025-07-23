import { Body, Controller, Post} from "@nestjs/common";
import { ParseIntPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    signup(@Body() dto:AuthDto) {
        console.log({dto,});
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin(@Body() dto:AuthDto) {
        return this.authService.signin(dto);
    }

    @Post('signout')
    signout() {
        return 'User logged out';
    }
}