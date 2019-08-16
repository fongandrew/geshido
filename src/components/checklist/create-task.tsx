import React, { useState, useCallback } from 'react';
import { createTaskForChecklist } from '../../stores/tasks';

export interface Props {
	checklistId: string;
}

/**
 * Input + button to create a new task
 */
export function CreateTask(props: Props) {
	const [name, setName] = useState('');
	const [valid, setValid] = useState(false);
	const setInputState = (value: string) => {
		setName(value);
		setValid(!!value);
	};

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target && e.target.value;
			setInputState(value);
		},
		[]
	);

	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (name) {
				createTaskForChecklist(props.checklistId, { name });
				setInputState('');
			}
		},
		[name, props.checklistId]
	);

	return (
		<form onSubmit={handleSubmit}>
			<input value={name} onChange={handleInputChange} />
			<button type="submit" disabled={!valid}>
				Submit
			</button>
		</form>
	);
}
