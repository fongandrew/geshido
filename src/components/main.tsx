import React, { PureComponent } from 'react';
import { AuthCheck } from './auth-check';
import { ChecklistsList } from './checklists-list';
import { CreateChecklist } from './create-checklist';
import { SigninSignoutButton } from './signin-signout-button';

interface Props {}

interface State {
	count: number;
}

export class Main extends PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			count: 0,
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState(({ count }) => ({
			count: count + 1,
		}));
	}

	render() {
		return (
			<div>
				<nav>
					<SigninSignoutButton />
				</nav>
				<main>
					<AuthCheck>
						<h1>Hello World</h1>
						<ChecklistsList />
						<CreateChecklist />
					</AuthCheck>
				</main>
			</div>
		);
	}
}
