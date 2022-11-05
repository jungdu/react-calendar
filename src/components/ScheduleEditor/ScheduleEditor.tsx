import React, { useState } from "react";
import styled from "@emotion/styled";
import { useCalendarState } from "../../store/calendarState";
import {
	convertToJsDate,
	formatHour,
	getCurrentWeek,
	getMilliseconds,
	getPercentInADay,
	isDateInRange,
} from "../../utils/date";
import { CalendarDate, Schedule } from "../../commonTypes/date";
import { getSteppedValue } from "../../utils/number";

const xAxisWidth = 50;
const rowHeight = 50;

const StyledScheduleEditor = styled.div`
	width: 600px;
`;

const StyledHourRow = styled.div`
	height: ${rowHeight}px;

	&::before{
		content: "";
		display: block;
		position: absolute;
		height: ${rowHeight}px;
		right: 0;
		left: 42px;
		height 1px;
		border-top: 1px solid #ccc;
		user-events: none;
		
		& ~ & {
			border-bottom: none;
		}
	}
`;

const StyledGrid = styled.div`
	position: relative;
	display: flex;
	width: 850px;
	margin-top: 50px;
`;

const StyledBorderedColumn = styled.div`
	position: relative;
	flex-grow: 1;
	border: 1px solid #ccc;

	& ~ & {
		border-left: none;
	}
`;

const StyledColumnClickArea = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
`;

const StyledXAxis = styled.div`
	flex: 0 0 ${xAxisWidth}px;
`;

const StyledHourText = styled.div`
	position: relative;
	top: 42px;
	text-align: right;
	margin-right: 10px;
	font-size: 13px;
`;

const StyledDateHeader = styled.div`
	position: absolute;
	top: -40px;
	font-size: 25px;
	width: 100%;
	text-align: center;
	user-events: none;
`;

const ScheduleEditor: React.FC = () => {
	const hours = Array.from({ length: 24 }, (_, i) => i);
	const datesInSelectedWeek = useCalendarState((state) =>
		getCurrentWeek(state.selectedDate)
	);
	// const [schedules, setSchedules] = useState<Schedule[]>([]);
	// const schedulesByDay = useMemo(() => {
	// 	return datesInSelectedWeek.map((date) => {
	// 		return schedules.filter((schedule) =>
	// 			isScheduleInTheDate(schedule, date)
	// 		);
	// 	});
	// }, [datesInSelectedWeek, schedules]);
	const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

	const handleClickMouseDown = (e1: React.MouseEvent, date: CalendarDate) => {
		const clickedTime = getClickedTime(e1, date);
		const startRange = getStartRange(clickedTime);

		setEditingSchedule(() => ({
			title: "New Schedule",
			startTime: startRange.startTime,
			endTime: startRange.endTime,
		}));

		const handleMouseMove = (e2: MouseEvent) => {
			const clickedTime = getClickedTime(e2, date);
			const nextTime = getNextTime(startRange, clickedTime);
			setEditingSchedule(
				(prev) =>
					prev && {
						...prev,
						...nextTime,
					}
			);
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const renderEditingSchedule = (date: CalendarDate) => {
		if (!editingSchedule) {
			return null;
		}
		if (!isScheduleInTheDate(editingSchedule, date)) {
			return null;
		}

		const { top, height } = getSchedulePosition(editingSchedule, date);
		return (
			<div
				style={{
					position: "absolute",
					top: top,
					height: height,
					backgroundColor: "#65a9ed",
					width: "100%",
					fontSize: "15px",
				}}
			>
				{editingSchedule.title}
			</div>
		);
	};

	return (
		<StyledScheduleEditor>
			<h1>Schedule Editor</h1>
			<StyledGrid>
				<StyledXAxis>
					{hours.map((hour) => (
						<StyledHourRow key={hour}>
							<StyledHourText>{formatHour(hour + 1)}</StyledHourText>
						</StyledHourRow>
					))}
				</StyledXAxis>
				{datesInSelectedWeek.map((date, i) => {
					return (
						<StyledBorderedColumn>
							<StyledDateHeader>{date.date}</StyledDateHeader>
							{renderEditingSchedule(date)}
							<StyledColumnClickArea
								onMouseDown={(e) => {
									handleClickMouseDown(e, date);
								}}
							/>
							{/* {schedulesByDay[i].map((schedule, j) => {
								const { top, height } = getSchedulePosition(schedule, date);
								return (
									<div
										key={`item-${i}-${j}`}
										style={{
											position: "absolute",
											top: top,
											height: height,
											backgroundColor: "#1e90ff",
											width: "100%",
											fontSize: "15px",
										}}
									>
										{schedule.title}
									</div>
								);
							})} */}
						</StyledBorderedColumn>
					);
				})}
			</StyledGrid>
		</StyledScheduleEditor>
	);
};

function getNextTime(
	startRage: {
		startTime: number;
		endTime: number;
	},
	clickedTime: number
): {
	startTime: number;
	endTime: number;
} {
	const { startTime, endTime } = startRage;
	if (clickedTime < startTime) {
		return {
			startTime: getSteppedValue(
				clickedTime,
				getMilliseconds({ minute: 30 }),
				false
			),
			endTime: endTime,
		};
	}
	return {
		startTime: startTime,
		endTime: getSteppedValue(
			clickedTime,
			getMilliseconds({ minute: 30 }),
			true
		),
	};
}

function getStartRange(clickedTime: number) {
	return {
		startTime: getSteppedValue(
			clickedTime,
			getMilliseconds({ minute: 30 }),
			false
		),
		endTime: getSteppedValue(
			clickedTime + getMilliseconds({ minute: 30 }),
			getMilliseconds({ minute: 30 }),
			false
		),
	};
}

function isScheduleInTheDate(schedule: Schedule, calendarDate: CalendarDate) {
	return isDateInRange(new Date(schedule.startTime), {
		start: calendarDate,
		end: {
			...calendarDate,
			date: calendarDate.date + 1,
		},
	});
}

function getSchedulePosition(schedule: Schedule, calendarDate: CalendarDate) {
	const startDateTime = convertToJsDate(calendarDate).getTime();
	const startPercent = getPercentInADay(schedule.startTime - startDateTime);
	const endPercent = getPercentInADay(schedule.endTime - startDateTime);

	return {
		top: `${startPercent}%`,
		height: `${endPercent - startPercent}%`,
	};
}

function getClickedTime(e: React.MouseEvent | MouseEvent, date: CalendarDate) {
	const target = e.target as HTMLElement;
	const rect = target.getBoundingClientRect();
	const y = e.clientY - rect.top;
	const jsDate = convertToJsDate(date);
	const result =
		jsDate.getTime() + (y / rect.height) * getMilliseconds({ date: 1 });
	return new Date(result).getTime();
}

export default ScheduleEditor;
