import React, { PureComponent } from 'react';

interface Props {}

interface State {
	count: number;
}

class Hello extends PureComponent<Props, State> {
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
				<h1>Hello World</h1>
				<button onClick={this.handleClick}>
					Clicked {this.state.count} times
				</button>
			</div>
		);
	}
}

export default Hello;
