import { CalendarDate, Schedule } from "../../commonTypes/date";
import { convertToJsDate, getPercentInADay } from "../../utils/date";

export function getSchedulePosition(
	schedule: Schedule,
	calendarDate: CalendarDate
) {
	const startDateTime = convertToJsDate(calendarDate).getTime();
	const startPercent = getPercentInADay(schedule.startTime - startDateTime);
	const endPercent = getPercentInADay(schedule.endTime - startDateTime);

	return {
		top: `${startPercent}%`,
		height: `${endPercent - startPercent}%`,
	};
}
