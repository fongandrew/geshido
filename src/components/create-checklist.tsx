import React, { useState, useCallback } from 'react';
import { createChecklistForCurrentUser } from '../stores/checklists';

/**
 * Input + button to create a new Checklist
 */
export function CreateChecklist() {
	const [name, setName] = useState('');
	const [valid, setValid] = useState(false);
	const setInputState = (value: string) => {
		setName(value);
		setValid(value ? true : false);
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
				createChecklistForCurrentUser({ name });
				setInputState('');
			}
		},
		[name]
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
