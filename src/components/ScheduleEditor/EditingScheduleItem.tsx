import styled from "@emotion/styled";
import React from "react";
import { CalendarDate } from "../../commonTypes/date";
import { isScheduleInTheDate } from "../../utils/date";
import { getSchedulePosition } from "./helper";
import { EditingSchedule } from "./types";

const StyledScheduleItem = styled.div<{
	top: string;
	height: string;
}>`
	position: absolute;
	top: ${({ top }) => top};
	height: ${({ height }) => height};
	background-color: #65a9ed;
	width: 100%;
	font-size: 15px;
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

	const { top, height } = getSchedulePosition(editingSchedule, calendarDate);
	return (
		<StyledScheduleItem top={top} height={height}>
			{editingSchedule.title}
		</StyledScheduleItem>
	);
};

export default EditingScheduleItem;
