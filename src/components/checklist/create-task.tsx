import React, { useState, useCallback } from 'react';
import { Button } from '~/components/kit/button';
import { Form } from '~/components/kit/form';
import { Text } from '~/components/kit/text';
import { createTaskForChecklist } from '~/stores/tasks';

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
		<Form onSubmit={handleSubmit} data-testid="create-task__form">
			<Text value={name} onChange={handleInputChange} />
			<Button type="submit" disabled={!valid}>
				Submit
			</Button>
		</Form>
	);
}
