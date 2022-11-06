import styled from "@emotion/styled";
import React from "react";
import { CalendarDate, Schedule } from "../../commonTypes/date";
import { formatDate } from "../../utils/date";
import { getSchedulePosition } from "./helper";

const StyledScheduleItem = styled.div<{
	top: string;
	height: string;
}>`
	box-sizing: border-box;
	position: absolute;
	top: ${({ top }) => top};
	height: ${({ height }) => height};
	background-color: #1e90ff;
	font-size: 14px;
	width: 100%;
	color: #fff;
	padding: 3px;
`;

const StyledScheduleTime = styled.div`
	font-size: 12px;
`;

interface Props {
	className?: string;
	schedule: Schedule;
	date: CalendarDate;
}

const ScheduleItem: React.FC<Props> = ({ className, schedule, date }) => {
	const { top, height } = getSchedulePosition(schedule, date);
	return (
		<StyledScheduleItem top={top} height={height} className={className}>
			<div>{schedule.title}</div>
			<StyledScheduleTime>
				{formatDate(schedule.startTime, "hh:mm")} -{" "}
				{formatDate(schedule.endTime, "hh:mm")}
			</StyledScheduleTime>
		</StyledScheduleItem>
	);
};

export default ScheduleItem;
