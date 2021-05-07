import type {
	ComponentLifecycle,
	ComponentType,
	FunctionComponent,
	ReactChild,
} from 'react';
import * as React from 'react';
import { Component, Suspense } from 'react';

export type ErrorFallbackComponentType = ComponentType<{
	retryFn?(): void;
	error: Error | null;
}>;

interface Props {
	fallback?: ReactChild;
	onError?: ComponentLifecycle<Props, unknown>['componentDidCatch'];
	errorFallback?: ErrorFallbackComponentType;
}

class ErrorBoundary extends Component<
	{ fallback?: ErrorFallbackComponentType; onError?: Props['onError'] },
	{ error: Error | null }
> {
	state = {
		error: null,
	};

	static getDerivedStateFromError(error) {
		return { error: error ?? null };
	}

	componentDidCatch(error, errorInfo) {
		this.props.onError?.(error, errorInfo);
	}

	retryFn = () => {
		this.setState((prev) => ({ ...prev, error: null }));
	};

	render() {
		const ErrorFallback =
			this.props.fallback ?? DefaultErrorFallbackComponent;
		return this.state.error ? (
			<ErrorFallback retryFn={this.retryFn} error={this.state.error} />
		) : (
			this.props.children
		);
	}
}

export const DefaultErrorFallbackComponent: ErrorFallbackComponentType = ({
	retryFn,
	error,
}) => (
	<p>
		An error has occurred, <button onClick={retryFn}>click here</button> to
		try again.
		{error ? <pre>{error.message}</pre> : null}
	</p>
);

export const DefaultFallback = <span>loading...</span>;

export const AsyncBoundary: FunctionComponent<Props> = ({
	children,
	onError,
	fallback = DefaultFallback,
	errorFallback,
}) => (
	<ErrorBoundary fallback={errorFallback} onError={onError}>
		<Suspense fallback={fallback}>{children}</Suspense>
	</ErrorBoundary>
);
