import { Schedule } from "../../commonTypes/date";

export type EditingSchedule = Schedule & {
	firstDragging: boolean;
};
