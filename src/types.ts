export type ThemeMode = 'violet' | 'inferno' | 'frost';

export type ActiveTab = 'home' | 'about' | 'events' | 'join';

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  departmentRole: string;
  category: 'guest' | 'faculty' | 'core-officer' | 'working-committee';
  subCategoryTitle?: string;
  description?: string;
  initials: string;
  photoUrl: string;
  badge?: string;
  tag?: string;
  college?: string;
  linkedin?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  caption: string;
  tag?: string;
}

export interface WorkshopEvent {
  id: string;
  date: string;
  tag: string;
  tagType: 'flagship' | 'contest' | 'symposium' | 'student-lab' | 'security' | 'developer-lab';
  title: string;
  description: string;
  timeline?: string;
  posterUrl?: string;
  tracks?: string[];
  sessionLeads?: string;
  guestSpeaker?: string;
  platform?: string;
  attendees?: string;
  location?: string;
  venue?: string;
  photosCount?: number;
  gallery: GalleryPhoto[];
}

export interface AdminPermissions {
  membershipApproval: boolean;
  manageEvents: boolean;
  manageLeadership: boolean;
  manageCredentials?: boolean;
}

export interface RegisteredAdmin {
  username: string;
  password?: string;
  roleTitle?: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  approvedAt?: string;
  permissions?: AdminPermissions;
}

export interface MembershipApplication {
  fullName: string;
  usn: string;
  year: string;
  branch: string;
  email: string;
  phone: string;
  interests: string[];
  githubProfile?: string;
  linkedinProfile?: string;
  experienceStatement: string;
}

export interface MailSettings {
  clubEmail: string;
  senderName: string;
  delayHours: number;
  acceptSubject: string;
  acceptBody: string;
  shortlistSubject: string;
  shortlistBody: string;
  updatedAt?: string;
}

export interface ScheduledEmail {
  id: string;
  applicationId: string;
  applicantName: string;
  recipientEmail: string;
  type: 'accept' | 'shortlist';
  subject: string;
  body: string;
  senderEmail: string;
  scheduledFor: string; // ISO timestamp
  status: 'scheduled' | 'sent';
  createdAt: string;
}

export interface ContactDetail {
  id: string;
  title: string;
  type: 'email' | 'phone' | 'location' | 'social' | 'office';
  value: string;
  description?: string;
  isPrimary?: boolean;
}

