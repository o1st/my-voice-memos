import { Layout } from "@components/Layout/Layout";
import { Loader } from "@components/Loader/Loader";
import { routes as memosRoutes } from "@features/memos";
import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";

const NotFoundPage = lazy(
	() => import("@components/NotFoundPage/NotFoundPage"),
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
