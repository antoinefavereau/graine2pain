import { Media } from "@/payload-types";

export interface Project {
  id: string;
  order: number;
  title: string;
  description: string;
  image: Media;
}
