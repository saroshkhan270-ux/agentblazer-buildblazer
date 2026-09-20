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
  tracks?: string[];
  sessionLeads?: string;
  guestSpeaker?: string;
  platform?: string;
  attendees?: string;
  location?: string;
  photosCount?: number;
  gallery: GalleryPhoto[];
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
