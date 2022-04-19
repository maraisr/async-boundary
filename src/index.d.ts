import type { ComponentType, ReactNode, FunctionComponent, ElementType } from "react";

export type ErrorFallbackComponentType = ElementType<{
	retryFn?(): void;
	error: Error | null;
}>;

interface Props {
	fallback?: ReactNode;
	onError?: ComponentLifecycle<Props, unknown>['componentDidCatch'];
	errorFallback?: ErrorFallbackComponentType;

    children?: ReactNode;
}

export type AsyncBoundaryComponent = FunctionComponent<Props>;

/**
 * A component that wraps an ErrorBoundary along with a Suspense boundary. Akin to;
 * 
 * ```jsx
 * <ErrorBoundary fallback={errorFallback}>
 *   <Suspense fallback={fallback}>
 *     your thing
 *   </Suspense>
 * </ErrorBoundary>
 * ```
 * 
 * @example
 * 
 * ```jsx
 * const ErrorFallback = ({error, retryFn}) => (
 *   <div>
 *     <pre>{error.message}</pre>
 *     <button onClick={retryFn}>Retry</button>
 *   </div>
 * );
 * 
 * const track = (error) => telemetry.captureException(error);
 * 
 * <AsyncBoundary
 *   errorFallback={ErrorFallback}
 *   fallback="loading..."
 *   onError={track}>
 *   ...
 * </AsyncBoundary>
 * ```
 */
export const AsyncBoundary: FunctionComponent<Props>;