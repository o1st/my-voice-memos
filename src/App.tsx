import { ErrorBoundary } from "@components/ErrorBoundary/ErrorBoundary";
import { Suspense } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";

function AppRoutes() {
	const element = useRoutes(routes);
	return <Suspense fallback={<div>Loading app...</div>}>{element}</Suspense>;
}

function App() {
	return (
		<BrowserRouter>
			<ErrorBoundary>
				<AppRoutes />
			</ErrorBoundary>
		</BrowserRouter>
	);
}

export default App;
