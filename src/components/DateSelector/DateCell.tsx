import React from "react";
import { CalendarDate } from "../../commonTypes/date";
import styled from "@emotion/styled";
import { useCalendarState } from "../../store/calendarState";
import { css } from "@emotion/react";
import { isSameDate } from "../../utils/date";

const StyledDataCell = styled.div<{
	isInCurrentMonth: boolean;
	isSelected: boolean;
}>`
	position: relative;
	display: inline-block;
	text-align: center;
	line-height: 50px;
	width: 50px;
	height: 50px;

	${({ isInCurrentMonth }) => (isInCurrentMonth ? "" : "color: #bbb;")}

	${({ isSelected }) =>
		isSelected
			? css`
					color: #fff;
					&::after {
						content: "";
						display: block;
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
						border-radius: 50%;
						background-color: #1a73e8;
						z-index: -1;
					}
			  `
			: ""}
`;

interface Props {
	calendarDate: CalendarDate;
}

const DateCell: React.FC<Props> = ({ calendarDate }) => {
	const currentMonthInDateSelector = useCalendarState(
		(state) => state.currentMonthInDateSelector
	);
	const selectDate = useCalendarState((state) => state.selectDate);
	const isInCurrentMonth =
		calendarDate.month === currentMonthInDateSelector.month &&
		calendarDate.year === currentMonthInDateSelector.year;
	const isSelected = useCalendarState((state) =>
		isSameDate(state.selectedDate, calendarDate)
	);

	const handleClick = () => {
		selectDate(calendarDate);
	};

	return (
		<StyledDataCell
			isInCurrentMonth={isInCurrentMonth}
			isSelected={isSelected}
			onClick={handleClick}
		>
			{calendarDate.date}
		</StyledDataCell>
	);
};

export default DateCell;
