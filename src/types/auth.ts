// Authorization related types
export type UserRole =
  | "Admin"
  | "Government"
  | "Student"
  | "Catering"
  | "Driver"
  | "Teacher";

export interface StudentProfile {
  studentProfileId: number;
  userId: number;
  schoolId: number;
  dateOfBirth: string;
  budget: number;
  expPoints: number;
  mbgPoints: number;
}

export interface AdminProfile {
  adminProfileId: number;
  userId: number;
  department: string;
}

export interface GovernmentProfile {
  governmentProfileId: number;
  userId: number;
  department: string;
}

export interface CateringProfile {
  cateringProfileId: number;
  userId: number;
  cateringId: number;
  position: string;
}

export interface TeacherProfile {
  teacherProfileId: number;
  userId: number;
  schoolId: number;
  subject: string;
}

export interface DriverProfile {
  driverProfileId: number;
  userId: number;
  vehicleType: string;
  licensePlate: string;
  cateringId: number;
}

export interface User {
  userId: number;
  userEmail: string;
  userFullName: string;
  userRole: UserRole;
  userPhoneNumber?: string;
  userProfilePictureLink?: string;
  isUserActive: boolean;
  lastLogin: string;
  studentProfile?: StudentProfile;
  adminProfile?: AdminProfile;
  governmentProfile?: GovernmentProfile;
  cateringProfile?: CateringProfile;
  teacherProfile?: TeacherProfile;
  driverProfile?: DriverProfile;
}

export interface AuthResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  user: User;
  studentProfileId?: number | null;
}

export interface LoginRequest {
  userEmail: string;
  userPassword: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  user: User;
}
