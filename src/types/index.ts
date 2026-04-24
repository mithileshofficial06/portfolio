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
