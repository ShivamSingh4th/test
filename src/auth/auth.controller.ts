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
        console.log(typeof(dto.email))
        return this.authService.signup(dto);
    }

    @Post('login')
    login() {
        return this.authService.login();
    }

    @Post('logout')
    logout() {
        return 'User logged out';
    }
}