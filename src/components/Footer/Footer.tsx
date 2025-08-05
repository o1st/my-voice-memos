import type React from "react";
import { Logo } from "../Logo/Logo";

export const Footer: React.FC = () => (
	<footer className="flex items-center justify-center px-4 py-3 bg-gray-50 border-t border-gray-200 mt-auto">
		<Logo variant="small" />
	</footer>
);
