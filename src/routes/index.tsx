import type { RouteObject } from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import { routes as memosRoutes } from "../features/memos/routes";
import { Outlet } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: memosRoutes,
  },
];
