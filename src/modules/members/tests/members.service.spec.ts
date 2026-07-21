import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from '../members.service';
import { MembersRepository } from '../members.repository';
import {
  buildCreateMemberDto,
  buildMemberDto,
  buildPaginatedMembersResponse,
  buildUpdateMemberDto,
  centralMemberIdFixture,
  memberIdFixture,
} from '../factories/member.factory';

describe('MembersService', () => {
  let service: MembersService;
  let repository: {
    create: jest.Mock;
    findAll: jest.Mock;
    findAllWithPagination: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    memberExists: jest.Mock;
    isFamilyMember: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllWithPagination: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      memberExists: jest.fn(),
      isFamilyMember: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: MembersRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  it('should create a member when no central member is provided', async () => {
    const createMemberDto = buildCreateMemberDto();
    const createdMember = buildMemberDto();
    repository.create.mockResolvedValue(createdMember);

    await expect(service.create(createMemberDto)).resolves.toEqual(
      createdMember,
    );

    expect(repository.memberExists).not.toHaveBeenCalled();
    expect(repository.isFamilyMember).not.toHaveBeenCalled();
    expect(repository.create).toHaveBeenCalledWith(createMemberDto);
  });

  it('should create a member when the central member exists and is not a family member', async () => {
    const createMemberDto = buildCreateMemberDto({
      centralMemberId: centralMemberIdFixture,
    });
    const createdMember = buildMemberDto({
      centralMemberId: centralMemberIdFixture,
    });
    repository.memberExists.mockResolvedValue(true);
    repository.isFamilyMember.mockResolvedValue(false);
    repository.create.mockResolvedValue(createdMember);

    await expect(service.create(createMemberDto)).resolves.toEqual(
      createdMember,
    );

    expect(repository.memberExists).toHaveBeenCalledWith(
      centralMemberIdFixture,
    );
    expect(repository.isFamilyMember).toHaveBeenCalledWith(
      centralMemberIdFixture,
    );
    expect(repository.create).toHaveBeenCalledWith(createMemberDto);
  });

  it('should throw when creating a member with a missing central member', async () => {
    const createMemberDto = buildCreateMemberDto({
      centralMemberId: centralMemberIdFixture,
    });
    repository.memberExists.mockResolvedValue(false);

    await expect(service.create(createMemberDto)).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(repository.memberExists).toHaveBeenCalledWith(
      centralMemberIdFixture,
    );
    expect(repository.isFamilyMember).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should throw when creating a member whose central member is already a family member', async () => {
    const createMemberDto = buildCreateMemberDto({
      centralMemberId: centralMemberIdFixture,
    });
    repository.memberExists.mockResolvedValue(true);
    repository.isFamilyMember.mockResolvedValue(true);

    await expect(service.create(createMemberDto)).rejects.toBeInstanceOf(
      ConflictException,
    );

    expect(repository.memberExists).toHaveBeenCalledWith(
      centralMemberIdFixture,
    );
    expect(repository.isFamilyMember).toHaveBeenCalledWith(
      centralMemberIdFixture,
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should find all members', async () => {
    const members = [buildMemberDto()];
    repository.findAll.mockResolvedValue(members);

    await expect(service.findAll()).resolves.toEqual(members);

    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should find all members with pagination', async () => {
    const paginatedRows = [buildMemberDto()];
    const paginatedResult = buildPaginatedMembersResponse(paginatedRows);
    repository.findAllWithPagination.mockResolvedValue(paginatedResult);

    await expect(service.findAllPaginated(20, 5)).resolves.toEqual({
      data: paginatedRows,
      total: 1,
      limit: 20,
      offset: 5,
    });

    expect(repository.findAllWithPagination).toHaveBeenCalledWith(20, 5);
  });

  it('should find a member by id', async () => {
    const member = buildMemberDto();
    repository.findOne.mockResolvedValue(member);

    await expect(service.findOne(memberIdFixture)).resolves.toEqual(member);

    expect(repository.findOne).toHaveBeenCalledWith(memberIdFixture);
  });

  it('should throw when a member cannot be found by id', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(memberIdFixture)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(repository.findOne).toHaveBeenCalledWith(memberIdFixture);
  });

  it('should update a member when the update payload is valid', async () => {
    const updateMemberDto = buildUpdateMemberDto();
    const existingMember = buildMemberDto();
    const updatedMember = buildMemberDto({ lastName: 'Byron' });
    repository.findOne.mockResolvedValue(existingMember);
    repository.update.mockResolvedValue(updatedMember);

    await expect(
      service.update(memberIdFixture, updateMemberDto),
    ).resolves.toEqual(updatedMember);

    expect(repository.findOne).toHaveBeenCalledWith(memberIdFixture);
    expect(repository.update).toHaveBeenCalledWith(
      memberIdFixture,
      updateMemberDto,
    );
  });

  it('should throw when updating a missing member', async () => {
    const updateMemberDto = buildUpdateMemberDto();
    repository.findOne.mockResolvedValue(null);

    await expect(
      service.update(memberIdFixture, updateMemberDto),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should throw when a member is updated to reference itself as central member', async () => {
    const updateMemberDto = buildUpdateMemberDto({
      centralMemberId: memberIdFixture,
    });
    repository.findOne.mockResolvedValue(buildMemberDto());

    await expect(
      service.update(memberIdFixture, updateMemberDto),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(repository.memberExists).not.toHaveBeenCalled();
    expect(repository.isFamilyMember).not.toHaveBeenCalled();
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should throw when updating a member with a missing central member', async () => {
    const updateMemberDto = buildUpdateMemberDto({
      centralMemberId: centralMemberIdFixture,
    });
    repository.findOne.mockResolvedValue(buildMemberDto());
    repository.memberExists.mockResolvedValue(false);

    await expect(
      service.update(memberIdFixture, updateMemberDto),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(repository.memberExists).toHaveBeenCalledWith(
      centralMemberIdFixture,
    );
    expect(repository.isFamilyMember).not.toHaveBeenCalled();
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should throw when updating a member with a family member as central member', async () => {
    const updateMemberDto = buildUpdateMemberDto({
      centralMemberId: centralMemberIdFixture,
    });
    repository.findOne.mockResolvedValue(buildMemberDto());
    repository.memberExists.mockResolvedValue(true);
    repository.isFamilyMember.mockResolvedValue(true);

    await expect(
      service.update(memberIdFixture, updateMemberDto),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(repository.memberExists).toHaveBeenCalledWith(
      centralMemberIdFixture,
    );
    expect(repository.isFamilyMember).toHaveBeenCalledWith(
      centralMemberIdFixture,
    );
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should delete a member', async () => {
    repository.findOne.mockResolvedValue(buildMemberDto());
    repository.delete.mockResolvedValue(undefined);

    await expect(service.delete(memberIdFixture)).resolves.toBeUndefined();

    expect(repository.findOne).toHaveBeenCalledWith(memberIdFixture);
    expect(repository.delete).toHaveBeenCalledWith(memberIdFixture);
  });

  it('should throw when deleting a missing member', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.delete(memberIdFixture)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(repository.delete).not.toHaveBeenCalled();
  });
});
