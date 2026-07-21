import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from '../members.controller';
import { MembersService } from '../members.service';
import {
  buildCreateMemberDto,
  buildMemberDto,
  buildUpdateMemberDto,
  memberIdFixture,
} from '../factories/member.factory';

describe('MembersController', () => {
  let controller: MembersController;
  let membersService: {
    create: jest.Mock;
    findAllPaginated: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    membersService = {
      create: jest.fn(),
      findAllPaginated: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        {
          provide: MembersService,
          useValue: membersService,
        },
      ],
    }).compile();

    controller = module.get<MembersController>(MembersController);
  });

  it('should create a member through the service', async () => {
    const createMemberDto = buildCreateMemberDto();
    const createdMember = buildMemberDto();
    membersService.create.mockResolvedValue(createdMember);

    await expect(controller.create(createMemberDto)).resolves.toEqual(
      createdMember,
    );

    expect(membersService.create).toHaveBeenCalledWith(createMemberDto);
  });

  it('should find all members using the default pagination values', async () => {
    const paginatedMembers = {
      data: [buildMemberDto()],
      total: 1,
      limit: 10,
      offset: 0,
    };
    membersService.findAllPaginated.mockResolvedValue(paginatedMembers);

    await expect(controller.findAll()).resolves.toEqual(paginatedMembers);

    expect(membersService.findAllPaginated).toHaveBeenCalledWith(10, 0);
  });

  it('should find all members using the provided pagination values', async () => {
    const paginatedMembers = {
      data: [buildMemberDto()],
      total: 1,
      limit: 25,
      offset: 5,
    };
    membersService.findAllPaginated.mockResolvedValue(paginatedMembers);

    await expect(controller.findAll('25', '5')).resolves.toEqual(
      paginatedMembers,
    );

    expect(membersService.findAllPaginated).toHaveBeenCalledWith(25, 5);
  });

  it('should find a member by id through the service', async () => {
    const member = buildMemberDto();
    membersService.findOne.mockResolvedValue(member);

    await expect(controller.findOne(memberIdFixture)).resolves.toEqual(member);

    expect(membersService.findOne).toHaveBeenCalledWith(memberIdFixture);
  });

  it('should update a member through the service', async () => {
    const updateMemberDto = buildUpdateMemberDto({ centralMemberId: null });
    const updatedMember = buildMemberDto({
      firstName: 'Ada',
      lastName: 'Byron',
    });
    membersService.update.mockResolvedValue(updatedMember);

    await expect(
      controller.update(memberIdFixture, updateMemberDto),
    ).resolves.toEqual(updatedMember);

    expect(membersService.update).toHaveBeenCalledWith(
      memberIdFixture,
      updateMemberDto,
    );
  });

  it('should delete a member through the service', async () => {
    membersService.delete.mockResolvedValue(undefined);

    await expect(controller.delete(memberIdFixture)).resolves.toBeUndefined();

    expect(membersService.delete).toHaveBeenCalledWith(memberIdFixture);
  });
});
