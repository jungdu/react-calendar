import styled from "@emotion/styled";
import React from "react";
import { createPortal } from "react-dom";
import { Schedule } from "../../commonTypes/date";
import { formatDate } from "../../utils/date";
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

const StyledTitle = styled.div`
	margin-bottom: 10px;
`;

const StyledTitleInput = styled.input`
	font-size: 20px;
	padding: 4px;
`;

const StyledButtonContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;
`;

const StyledButton = styled.button`
	font-size: 15px;
	padding: 4px 8px;
	margin-right: 10px;
	border-radius: 4px;
	border: 1px solid #999;
	background-color: #fff;
	color: #555;
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

	const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditingSchedule({
			...editingSchedule,
			title: e.target.value,
		});
	};

	return createPortal(
		<StyledModalContainer>
			<StyledDimmed />
			<StyledModal>
				<StyledTitle>
					<StyledTitleInput
						value={editingSchedule.title}
						onChange={handleChangeTitle}
					/>
				</StyledTitle>
				<div>
					{formatDate(editingSchedule.startTime, "YYYY년 MM월 DD일 ")}{" "}
					{formatDate(editingSchedule.startTime, "hh:mm")} -{" "}
					{formatDate(editingSchedule.endTime, "hh:mm")}
				</div>
				<StyledButtonContainer>
					<StyledButton onClick={handleSave}>SAVE</StyledButton>
					<StyledButton onClick={handleCancel}>CANCEL</StyledButton>
				</StyledButtonContainer>
			</StyledModal>
		</StyledModalContainer>,
		modalRoot
	);
};

export default CreateScheduleModal;
