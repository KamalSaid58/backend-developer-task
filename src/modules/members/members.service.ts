import { Injectable } from '@nestjs/common';
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
   * @param member - The member to create
   * @returns The created member
   */
  async create(member: CreateMemberDTO): Promise<MemberDTO> {
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
    return this.repository.findOne(id);
  }

  async update(id: string, member: UpdateMemberDTO): Promise<MemberDTO> {
    return this.repository.update(id, member);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
