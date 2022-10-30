import React from "react";
import DateSelector from "./components/DateSelector/DateSelector";
import ScheduleEditor from "./components/ScheduleEditor/ScheduleEditor";

function App() {
	return (
		<div className="App">
			<h1>Google Calendar</h1>
			<DateSelector />
			<ScheduleEditor />
		</div>
	);
}

export default App;
