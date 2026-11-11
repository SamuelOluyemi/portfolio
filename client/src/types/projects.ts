export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  category: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  imageUrl?: string;
}
