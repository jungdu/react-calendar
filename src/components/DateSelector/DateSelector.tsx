import React from "react";
import styled from "@emotion/styled";
import { getDisplayDates } from "../../utils/date";
import { useCalendarState } from "../../store/calendarState";
import { getDay } from "./helper";
import { getChunkedArray } from "../../utils/array";
import DateCell from "./DateCell";
import ChangeMonthButtons from "./ChangeMonthButtons";

const StyledDateSelectorHeader = styled.div`
	width: 100%;
	display: flex;
	margin-bottom: 20px;
`;

const DateSelectorContainer = styled.div`
	width: 350px;
	padding: 20px;
`;

const StyledDayCell = styled.span`
	display: inline-block;
	text-align: center;
	width: 50px;
	margin-bottom: 11px;
`;

const StyledCurrentMonth = styled.span`
	font-size: 20px;
	font-weight: bold;
	color: #444;
`;

const StyledDateRow = styled.div``;

const DateSelector: React.FC = () => {
	const days = new Array(7).fill(0).map((_, i) => i);
	const currentMonthInDateSelector = useCalendarState(
		(state) => state.currentMonthInDateSelector
	);
	const displayDates = getDisplayDates(currentMonthInDateSelector);
	const displayWeeks = getChunkedArray(displayDates, 7);

	return (
		<DateSelectorContainer>
			<StyledDateSelectorHeader>
				<StyledCurrentMonth>
					{currentMonthInDateSelector.year}년 {currentMonthInDateSelector.month}
					월
				</StyledCurrentMonth>
				<ChangeMonthButtons />
			</StyledDateSelectorHeader>
			<div>
				{days.map((i) => {
					return <StyledDayCell key={i}>{getDay(i)}</StyledDayCell>;
				})}
			</div>
			{displayWeeks.map((week, i) => {
				return (
					<StyledDateRow key={i}>
						{week.map((date, j) => {
							return <DateCell calendarDate={date} key={j} />;
						})}
					</StyledDateRow>
				);
			})}
		</DateSelectorContainer>
	);
};

export default DateSelector;
