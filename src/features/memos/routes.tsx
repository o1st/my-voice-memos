import type { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ROUTES } from "./routes-config";
import { Loader } from "@components/Loader/Loader";

const MemosListPage = lazy(() => import("./pages/list"));
const NewMemoPage = lazy(() => import("./pages/new"));
const MemoViewPage = lazy(() => import("./pages/view"));
const MemoEditPage = lazy(() => import("./pages/edit"));

export const routes: RouteObject[] = [
  {
    path: ROUTES.LIST,
    element: (
      <Suspense fallback={<Loader />}>
        <MemosListPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.NEW,
    element: (
      <Suspense fallback={<Loader />}>
        <NewMemoPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.VIEW,
    element: (
      <Suspense fallback={<Loader />}>
        <MemoViewPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.EDIT,
    element: (
      <Suspense fallback={<Loader />}>
        <MemoEditPage />
      </Suspense>
    ),
  },
];
