import type React from "react";
import { memo } from "react";
import { Button } from "../Button/Button";
import { Loader } from "../Loader/Loader";

interface DataStateWrapperProps {
	loading: boolean;
	error: string | null;
	children: React.ReactNode;
	loadingClassName?: string;
	errorClassName?: string;
	emptyState?: {
		show: boolean;
		message: string;
		actionLabel?: string;
		onAction?: () => void;
	};
	errorAction?: {
		label: string;
		onClick: () => void;
	};
}

export const DataStateWrapper: React.FC<DataStateWrapperProps> = memo(
	({
		loading,
		error,
		children,
		loadingClassName = "flex justify-center items-center py-8",
		errorClassName = "text-center py-8",
		emptyState,
		errorAction,
	}) => {
		if (loading) {
			return (
				<div className={loadingClassName}>
					<Loader />
				</div>
			);
		}

		if (error) {
			return (
				<div className={errorClassName}>
					<div className="text-red-600 mb-4">{error}</div>
					{errorAction && (
						<Button variant="primary" onClick={errorAction.onClick}>
							{errorAction.label}
						</Button>
					)}
				</div>
			);
		}

		if (emptyState?.show) {
			return (
				<div className="text-center py-8">
					<div className="text-gray-600 mb-4">{emptyState.message}</div>
					{emptyState.onAction && emptyState.actionLabel && (
						<Button variant="primary" onClick={emptyState.onAction}>
							{emptyState.actionLabel}
						</Button>
					)}
				</div>
			);
		}

		return <>{children}</>;
	},
);
