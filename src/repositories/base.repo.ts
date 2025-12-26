import { TABLE_NAME } from "../constants/table";

export abstract class BaseRepository {
  protected tableName = TABLE_NAME;

  // Helper to generate Partition Key
  protected getPK(season: number | string): string {
    return `SEASON#${season}`;
  }

  // Helper to generate Match Sort Key
  protected getMatchSK(id: string): string {
    return `MATCH#${id}`;
  }
}