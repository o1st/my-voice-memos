import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { Suspense } from "react";
import { ErrorBoundary } from "@components/ErrorBoundary/ErrorBoundary";

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
