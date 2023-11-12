import { Screenings } from "@/database";
import { Insertable, Selectable, Updateable } from "kysely";

export type ScreeningRow = Screenings
export type ScreeningRowWithoutId = Omit<ScreeningRow, 'id'>;
export type ScreeningRowInsert = Insertable<ScreeningRowWithoutId>;
export type ScreeningRowUpdate = Updateable<ScreeningRowWithoutId>;
export type ScreeningRowSelect = Selectable<ScreeningRow>;