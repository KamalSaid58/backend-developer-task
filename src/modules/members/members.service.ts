import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMemberDTO } from 'src/modules/members/dto/create-member.dto';
import { MemberDTO } from 'src/modules/members/dto/member.dto';
import { UpdateMemberDTO } from 'src/modules/members/dto/update-member.dto';
import { MembersRepository } from 'src/modules/members/members.repository';
import { PaginatedResponseDTO } from 'src/common/dto/paginated-response.dto';

@Injectable()
export class MembersService {
  constructor(private readonly repository: MembersRepository) {}

  /**
   * This method creates a new member
   * Validates family member constraints:
   * - Member cannot be their own central member
   * - Central member must exist
   * - Family member cannot have family members (no recursive relationships)
   *
   * @param member - The member to create
   * @returns The created member
   * @throws BadRequestException if validation fails
   */
  async create(member: CreateMemberDTO): Promise<MemberDTO> {
    if (member.centralMemberId) {
      // 1. Central member must exist
      const centralMemberExists = await this.repository.memberExists(
        member.centralMemberId,
      );
      if (!centralMemberExists) {
        throw new BadRequestException(
          `Central member with ID "${member.centralMemberId}" does not exist`,
        );
      }

      // 2. A family member cannot be a central member (no recursive relationships)
      const isCentralMemberAFamilyMember = await this.repository.isFamilyMember(
        member.centralMemberId,
      );
      if (isCentralMemberAFamilyMember) {
        throw new ConflictException(
          'Central member cannot be a family member. Family members cannot have their own family members.',
        );
      }
    }

    return this.repository.create(member);
  }

  /**
   * This method finds all members
   * FIXME: A club can have more than 100k members, wow!
   * Can we find a way to return the members in an efficient way?
   */
  async findAll(): Promise<MemberDTO[]> {
    return this.repository.findAll();
  }

  /**
   * Fetches members with offset/limit pagination.
   * Prevents sending massive result sets to the client.
   *
   * @param limit - Maximum number of members per page
   * @param offset - Number of members to skip
   * @returns Paginated response with data, total, limit, offset
   */
  async findAllPaginated(
    limit: number,
    offset: number,
  ): Promise<PaginatedResponseDTO<MemberDTO>> {
    const { rows, count } = await this.repository.findAllWithPagination(
      limit,
      offset,
    );

    return {
      data: rows,
      total: count,
      limit,
      offset,
    };
  }

  async findOne(id: string): Promise<MemberDTO> {
    const member = await this.repository.findOne(id);
    if (!member) {
      throw new NotFoundException(`Member with ID "${id}" not found`);
    }
    return member;
  }

  /**
   * Updates a member
   * Validates:
   * - Member cannot be their own central member
   * - Central member must exist (if being set)
   * - Family member cannot have family members
   *
   * @param id - Member ID to update
   * @param member - Fields to update
   * @returns Updated member
   * @throws BadRequestException if validation fails
   */
  async update(id: string, member: UpdateMemberDTO): Promise<MemberDTO> {
    // Check if member exists first
    const existingMember = await this.repository.findOne(id);
    if (!existingMember) {
      throw new NotFoundException(`Member with ID "${id}" not found`);
    }

    // Validate family member constraints if centralMemberId is being updated
    if (member.centralMemberId !== undefined) {
      // 1. A member cannot be their own central member
      if (member.centralMemberId === id) {
        throw new ConflictException(
          'A member cannot be their own central member',
        );
      }

      // 2. Central member must exist
      const centralMemberExists = await this.repository.memberExists(
        member.centralMemberId,
      );
      if (!centralMemberExists) {
        throw new BadRequestException(
          `Central member with ID "${member.centralMemberId}" does not exist`,
        );
      }

      // 3. A family member cannot be a central member
      const isCentralMemberAFamilyMember = await this.repository.isFamilyMember(
        member.centralMemberId,
      );
      if (isCentralMemberAFamilyMember) {
        throw new ConflictException(
          'Central member cannot be a family member. Family members cannot have their own family members.',
        );
      }
    }

    return this.repository.update(id, member);
  }

  async delete(id: string): Promise<void> {
    const member = await this.repository.findOne(id);
    if (!member) {
      throw new NotFoundException(`Member with ID "${id}" not found`);
    }
    return this.repository.delete(id);
  }
}
