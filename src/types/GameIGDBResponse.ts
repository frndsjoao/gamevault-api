import { Platform } from "./Platforms";

export interface ReleaseDatesIGDB {
  platform: number;
  y: number;
  human: string;
}

export interface GameIGDBResponse {
  id: number
  cover: { id: number; image_id: string }
  name: string;
  platforms: Platform[]
  release_dates: ReleaseDatesIGDB[]
}