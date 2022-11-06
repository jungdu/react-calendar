import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { useCalendarState } from "../../store/calendarState";
import {
	convertToJsDate,
	formatHour,
	getCurrentWeek,
	getMilliseconds,
	isScheduleInTheDate,
} from "../../utils/date";
import { CalendarDate, Schedule } from "../../commonTypes/date";
import { getSteppedValue } from "../../utils/number";
import CreateScheduleModal from "./CreateScheduleModal";
import { nanoid } from "nanoid";
import { EditingSchedule } from "./types";
import { getSchedulePosition } from "./helper";
import EditingScheduleItem from "./EditingScheduleItem";

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
	const [schedules, setSchedules] = useState<Schedule[]>([]);
	const schedulesByDay = useMemo(() => {
		return datesInSelectedWeek.map((date) => {
			return schedules.filter((schedule) =>
				isScheduleInTheDate(schedule, date)
			);
		});
	}, [datesInSelectedWeek, schedules]);
	const [editingSchedule, setEditingSchedule] =
		useState<EditingSchedule | null>(null);

	const handleClickMouseDown = (e1: React.MouseEvent, date: CalendarDate) => {
		const containerElem = e1.currentTarget as HTMLElement;
		const clickedTime = getClickedTime(e1, containerElem, date);
		const startRange = getStartRange(clickedTime);
		const newSchedule = {
			id: nanoid(),
			title: "(No Title)",
			startTime: startRange.startTime,
			endTime: startRange.endTime,
			firstDragging: true,
		};
		setEditingSchedule(() => newSchedule);

		const handleMouseMove = (e2: MouseEvent) => {
			const clickedTime = getClickedTime(e2, containerElem, date);
			const nextTime = getNextTime(startRange, clickedTime);
			newSchedule.startTime = nextTime.startTime;
			newSchedule.endTime = nextTime.endTime;
			setEditingSchedule(() => ({ ...newSchedule }));
		};

		const handleMouseUp = () => {
			setEditingSchedule(() => ({ ...newSchedule, firstDragging: false }));
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	return (
		<>
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
								<EditingScheduleItem
									calendarDate={date}
									editingSchedule={editingSchedule}
								/>
								<StyledColumnClickArea
									onMouseDown={(e) => {
										handleClickMouseDown(e, date);
									}}
								/>
								{schedulesByDay[i].map((schedule, j) => {
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
								})}
							</StyledBorderedColumn>
						);
					})}
				</StyledGrid>
			</StyledScheduleEditor>
			<CreateScheduleModal
				editingSchedule={editingSchedule}
				setEditingSchedule={setEditingSchedule}
				saveSchedule={(schedule) => {
					setSchedules((prev) => [...prev, schedule]);
				}}
			/>
		</>
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

function getClickedTime(
	e: React.MouseEvent | MouseEvent,
	containerElem: HTMLElement,
	date: CalendarDate
) {
	const rect = containerElem.getBoundingClientRect();
	const y = e.clientY - rect.top;
	const jsDate = convertToJsDate(date);
	const result =
		jsDate.getTime() + (y / rect.height) * getMilliseconds({ date: 1 });
	return new Date(result).getTime();
}

export default ScheduleEditor;
