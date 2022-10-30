import React from "react";
import styled from "@emotion/styled";
import { useCalendarState } from "../../store/calendarState";
import { getNextMonth, getPrevMonth } from "../../utils/date";

const StyledChangeMonthButtons = styled.div`
	margin-left: auto;
`;

const ChangeMonthButtons: React.FC = () => {
	const currentMonthInDateSelector = useCalendarState(
		(state) => state.currentMonthInDateSelector
	);
	const setCurrentMonthInDateSelector = useCalendarState(
		(state) => state.setCurrentMonthInDateSelector
	);

	return (
		<StyledChangeMonthButtons>
			<button
				onClick={() =>
					setCurrentMonthInDateSelector(
						getPrevMonth(currentMonthInDateSelector)
					)
				}
			>{`<`}</button>
			<button
				onClick={() =>
					setCurrentMonthInDateSelector(
						getNextMonth(currentMonthInDateSelector)
					)
				}
			>{`>`}</button>
		</StyledChangeMonthButtons>
	);
};

export default ChangeMonthButtons;
