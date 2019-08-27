import React, { useState, useCallback } from 'react';
import { Button } from '~/components/kit/button';
import { Form } from '~/components/kit/form';
import { Text } from '~/components/kit/text';
import { createChecklistForCurrentUser } from '~/stores/checklists';

/**
 * Input + button to create a new Checklist
 */
export function CreateChecklist() {
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
				createChecklistForCurrentUser({ name });
				setInputState('');
			}
		},
		[name]
	);

	return (
		<Form onSubmit={handleSubmit} data-testid="create-checklist__form">
			<Text value={name} onChange={handleInputChange} />
			<Button type="submit" disabled={!valid}>
				Submit
			</Button>
		</Form>
	);
}
