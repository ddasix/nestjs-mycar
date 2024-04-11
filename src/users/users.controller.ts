import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthUserDTO, CreateUserDTO, UpdateUserDTO, UserDTO } from './dtos';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService) { }

    @Get('/me')
    @UseGuards(AuthGuard)
    getMe(@CurrentUser() user: string) {
        return user;
    }

    @Post('/signup')
    async crateUser(@Body() body: CreateUserDTO, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: AuthUserDTO, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    signout(@Session() session: any) {
        session.userId = null;
    }

    @Get('/:id')
    async findOneById(@Param('id') id: string) {
        const user = await this.usersService.findOne(parseInt(id));

        if (!user) {
            throw new NotFoundException('User Not Found');
        }

        return user;
    }

    @Get('')
    findUsersByEmail(@Query('email') email: string) {
        return this.usersService.findAllByEmail(email);
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() user: UpdateUserDTO) {
        return this.usersService.update(parseInt(id), user);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }
}
