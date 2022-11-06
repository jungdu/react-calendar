import styled from "@emotion/styled";
import React from "react";
import { createPortal } from "react-dom";
import { Schedule } from "../../commonTypes/date";
import { EditingSchedule } from "./types";

const StyledModalContainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;

const StyledDimmed = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.45);
`;

const StyledModal = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 400px;
	height: 300px;
	background-color: #fff;
	border-radius: 4px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	padding: 20px;
`;

interface Props {
	editingSchedule: EditingSchedule | null;
	setEditingSchedule: (editingSchedule: EditingSchedule | null) => void;
	saveSchedule: (schedule: Schedule) => void;
}

const modalRoot = document.getElementById("modal-root") as HTMLElement;

const CreateScheduleModal: React.FC<Props> = ({
	editingSchedule,
	setEditingSchedule,
	saveSchedule,
}) => {
	if (!editingSchedule || editingSchedule.firstDragging) return null;

	const handleCancel = () => {
		setEditingSchedule(null);
	};

	const handleSave = () => {
		saveSchedule(editingSchedule);
		setEditingSchedule(null);
	};

	return createPortal(
		<StyledModalContainer>
			<StyledDimmed />
			<StyledModal>
				<div>{editingSchedule.title}</div>
				<div>시작: {editingSchedule.startTime}</div>
				<div>종료: {editingSchedule.endTime}</div>
				<div>
					<button onClick={handleSave}>저장</button>
					<button onClick={handleCancel}>취소</button>
				</div>
			</StyledModal>
		</StyledModalContainer>,
		modalRoot
	);
};

export default CreateScheduleModal;
