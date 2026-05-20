export interface Project {
  id: number;
  name: string;
  badge: string;
  description: string;
  stack: string[];
  type: string;
  status: string;
  impact: string;
  github: string | null;
  live: string | null;
}

export interface Hackathon {
  id: number;
  name: string;
  organizer: string;
  achievement: string;
  project?: string;
  year: number;
}

export interface PersonalInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  college: string;
  location: string;
  bio: string;
  education: string;
  certifications: string[];
}
