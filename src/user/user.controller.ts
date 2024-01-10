import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/user.login-dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Get()
    findAll() {
        return this.userService.findAllUser();
    }

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleLogin() {}

    @Get('/google/callback')
    @UseGuards(AuthGuard('google'))
    async callback(@Req() req, @Res() res) {
        const jwt = await this.userService.login(req.user);
        res.set('authorization', jwt.accessToken);
        res.json(req.user);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.viewUser(+id);
    }

    @Post('/sign-in')
    @UseGuards(AuthGuard('local'))
    async login(@Request() req): Promise<LoginUserDto> {
        return this.userService.login(req.user);
    }

    @Patch()
    @UseGuards(AuthGuard('jwt'))
    updateUserById(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return this.userService.updateUser(req.user.id, updateUserDto);
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'))
    deleteUser(@Request() req): Promise<void> {
        return this.userService.removeUser(req.user.id);
    }
}
