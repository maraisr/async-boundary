import type {
	ComponentLifecycle,
	ComponentType,
	FunctionComponent,
	ReactChild,
} from 'react';
import * as React from 'react';
import { PureComponent, Suspense } from 'react';

type ErrorFallbackComponent = ComponentType<{ retryFn?(): void }>;

interface Props {
	fallback?: ReactChild;
	onError?: ComponentLifecycle<Props, unknown>['componentDidCatch'];
	errorFallback?: ErrorFallbackComponent;
}

class ErrorBoundary extends PureComponent<
	{ fallback?: ErrorFallbackComponent; onError?: Props['onError'] },
	{ error: Error | null }
> {
	state = {
		error: null,
	};

	static getDerivedStateFromError(error) {
		return { error: error ?? null };
	}

	componentDidCatch(error, errorInfo) {
		this.props?.onError(error, errorInfo);
	}

	retryFn = () => {
		this.setState((prev) => ({ ...prev, error: null }));
	};

	render() {
		const ErrorFallback = this.props.fallback ?? ErrorFallbackComponent;
		return this.state.error ? (
			<ErrorFallback retryFn={this.retryFn} />
		) : (
			this.props.children
		);
	}
}

const ErrorFallbackComponent: ErrorFallbackComponent = ({ retryFn }) => {
	return (
		<p>
			An error has occurred, <button onClick={retryFn}>click here</button>{' '}
			to try again.
		</p>
	);
};

const Fallback = <span>loading...</span>;

export const AsyncBoundary: FunctionComponent<Props> = ({
	children,
	onError,
	fallback = Fallback,
	errorFallback,
}) => (
	<ErrorBoundary fallback={errorFallback} onError={onError}>
		<Suspense fallback={fallback}>{children}</Suspense>
	</ErrorBoundary>
);
