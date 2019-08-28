import React, { useCallback } from 'react';
import { Button } from '~/components/kit/button';
import { checkInToTask } from '~/stores/checkins';

export interface Props {
	checklistId: string;
	taskId: string;
}

export function CheckinButton({ checklistId, taskId }: Props) {
	const handleClick = useCallback(() => {
		checkInToTask(checklistId, taskId);
	}, [checklistId, taskId]);

	return (
		<Button data-testid="checkin-button" onClick={handleClick}>
			✔
		</Button>
	);
}
