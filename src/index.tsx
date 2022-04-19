import { Component, Suspense } from 'react';
import type { ComponentProps, ReactNode } from 'react';

import type {
	AsyncBoundaryComponent,
	ErrorFallbackComponentType,
} from 'async-boundary';

type Props = {
	fallback?: ErrorFallbackComponentType;
	onError?: ComponentProps<AsyncBoundaryComponent>['onError'];
	children?: ReactNode;
};
type State = { error: Error | null };

const DefaultErrorFallbackComponent: ErrorFallbackComponentType = ({
	retryFn,
	error,
}) => (
	<p>
		An error has occurred, <button onClick={retryFn}>click here</button> to
		try again.
		{error ? <pre>{error.message}</pre> : null}
	</p>
);

class ErrorBoundary extends Component<Props, State> {
	state = {
		error: null,
	};

	static getDerivedStateFromError(error: Error) {
		return { error: error ?? null };
	}

	componentDidCatch(error: Error, errorInfo: unknown) {
		this.props.onError?.(error, errorInfo);
	}

	retryFn = () => {
		this.setState({ error: null });
	};

	render() {
		const { children, fallback } = this.props;

		const Fallback = fallback ?? DefaultErrorFallbackComponent;

		return this.state.error ? (
			<Fallback retryFn={this.retryFn} error={this.state.error} />
		) : (
			children
		);
	}
}

const DefaultFallback = <span>loading...</span>;

export const AsyncBoundary: AsyncBoundaryComponent = ({
	children,
	onError,
	fallback = DefaultFallback,
	errorFallback,
}) => (
	<ErrorBoundary fallback={errorFallback} onError={onError}>
		<Suspense fallback={fallback}>{children}</Suspense>
	</ErrorBoundary>
);
