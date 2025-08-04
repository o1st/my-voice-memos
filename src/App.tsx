import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { Suspense } from "react";

function AppRoutes() {
  const element = useRoutes(routes);
  return <Suspense fallback={<div>Loading app...</div>}>{element}</Suspense>;
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
