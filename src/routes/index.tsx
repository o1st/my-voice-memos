import type { RouteObject } from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import { routes as memosRoutes } from "../features/memos/routes";
import { Outlet, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader } from "../components/Loader/Loader";

const NotFoundPage = lazy(
  () => import("../components/NotFoundPage/NotFoundPage")
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/memos" replace />,
      },
      ...memosRoutes,
      {
        path: "*",
        element: (
          <Suspense fallback={<Loader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
];
