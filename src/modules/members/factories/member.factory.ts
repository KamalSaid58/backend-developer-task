import { CreateMemberDTO } from '../dto/create-member.dto';
import { MemberDTO } from '../dto/member.dto';
import { UpdateMemberDTO } from '../dto/update-member.dto';

export const memberIdFixture = '11111111-1111-1111-1111-111111111111';
export const centralMemberIdFixture = '22222222-2222-2222-2222-222222222222';

export const buildCreateMemberDto = (
  overrides: Partial<CreateMemberDTO> = {},
): CreateMemberDTO => ({
  firstName: 'Ada',
  lastName: 'Lovelace',
  gender: 'female',
  dateOfBirth: '2003-07-17',
  phone: '+201001234567',
  ...overrides,
});

export const buildUpdateMemberDto = (
  overrides: Partial<UpdateMemberDTO> = {},
): UpdateMemberDTO => ({
  firstName: 'Ada',
  lastName: 'Byron',
  gender: 'female',
  dateOfBirth: '2003-07-18',
  phone: '+201001234568',
  ...overrides,
});

export const buildMemberDto = (
  overrides: Partial<MemberDTO> = {},
): MemberDTO => ({
  id: memberIdFixture,
  firstName: 'Ada',
  lastName: 'Lovelace',
  gender: 'female',
  dateOfBirth: '17-07-2003',
  phone: '+201001234567',
  centralMemberId: undefined,
  ...overrides,
});

export const buildPaginatedMembersResponse = (members: MemberDTO[] = []) => ({
  rows: members,
  count: members.length,
});
