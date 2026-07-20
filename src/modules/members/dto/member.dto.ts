export class MemberDTO {
  id: string;
  firstName: string;
  lastName: string;
  gender: string; // 'male' or 'female'
  dateOfBirth: string; // Format: DD-MM-YYYY (e.g., 17-07-2003)
  phone?: string;
  centralMemberId?: string; // UUID of central member if this is a family member
}
