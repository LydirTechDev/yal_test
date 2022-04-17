import {
  Controller,
  Get,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiQuery } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';
import { UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  /**
   *
   * @param usersService
   */
  constructor(private readonly usersService: UsersService) {}

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'searchUserTerm', type: String, required: false })
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query('searchUserTerm') searchUserTerm: string,
  ): Promise<Pagination<User>> {
    return this.usersService.findAllV2(
      {
        page,
        limit,
      },
      searchUserTerm,
    );
  }
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.usersService.update(id, updateUserDto);
  }
  @Get('getCountUser')
  getCountUser() {
    return this.usersService.countUsers();
  }

  @Patch(':id/setActivity')
  updateActvivty(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
