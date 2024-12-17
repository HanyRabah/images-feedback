export const Roles = {
    ADMIN: 'ADMIN',
    CLIENT: 'CLIENT',
  } as const;
  
  export type Role = typeof Roles[keyof typeof Roles];
  
  export const ImageStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    PASSED: 'PASSED',
  } as const;
  
  export type ImageStatus = typeof ImageStatus[keyof typeof ImageStatus];
  
  // Type guards
  export const isValidRole = (role: string): role is Role => {
    return Object.values(Roles).includes(role as Role);
  };
  
  export const isValidImageStatus = (status: string): status is ImageStatus => {
    return Object.values(ImageStatus).includes(status as ImageStatus);
  };