import styled from "@emotion/styled";
import React from "react";
import { CalendarDate } from "../../commonTypes/date";
import { isScheduleInTheDate } from "../../utils/date";
import ScheduleItem from "./ScheduleItem";
import { EditingSchedule } from "./types";

const StyledScheduleItem = styled(ScheduleItem)`
	background-color: #65a9ed;
`;

interface Props {
	editingSchedule: EditingSchedule | null;
	calendarDate: CalendarDate | null;
}

const EditingScheduleItem: React.FC<Props> = ({
	editingSchedule,
	calendarDate,
}) => {
	if (!editingSchedule || !calendarDate) return null;
	if (!isScheduleInTheDate(editingSchedule, calendarDate)) {
		return null;
	}

	return <StyledScheduleItem schedule={editingSchedule} date={calendarDate} />;
};

export default EditingScheduleItem;
