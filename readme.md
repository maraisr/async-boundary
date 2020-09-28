# `async-boundary`

[![CI](https://img.shields.io/github/workflow/status/maraisr/async-boundary/CI/main)](https://github.com/maraisr/async-boundary/actions?query=workflow:CI+branch:main)

> A React async-boundary that couples an error-boundary as well as a suspense container

## ⚙️ Install

```sh
yarn add async-boundary
```

## 🚀 Usage

```tsx
import { AsyncBoundary } from 'async-boundary';

const SuspensfulContainer = () => {
	return (
		<AsyncBoundary>
			<SlowSuspensfulComponent />
		</AsyncBoundary
	);
};

const SlowSuspensfulComponent = () => {
	const data = resource.data.read();

	return <h1>{data.thing}</h1>
}
```

> Please read more about suspense at [Concurrent React (Suspense for Data Fetching)](https://reactjs.org/docs/concurrent-mode-suspense.html)

## 🔎 API

### AsyncBoundary: FunctionComponent<Props>

#### Props
- `fallback`: The `ReactChild` to render whilst Suspending
- `errorFallback`: The `ReactChild` to render when an error occurred.
  - Has a `retryFn` callback passed to it, calling it will remount the `<AsyncBoundary>` children.
- `onError`: The `componentDidCatch` callback.

## License

MIT © [Marais Rossouw](https://marais.io)
