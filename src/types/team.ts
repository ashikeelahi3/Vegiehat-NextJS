export type SocialLink = {
  id: number;
  name: string;
  url: string;
};

export type TeamMember = {
  id: number;
  name: string;
  description: string;
  skills?: string;
  social_links?: SocialLink[];
  hobbies?: string;
  image: string;
  role?: string;
};