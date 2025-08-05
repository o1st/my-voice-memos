import type React from "react";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => (
	<div className="min-h-screen flex flex-col bg-white">
		<Header />
		<main className="flex-1 px-4 py-6">{children}</main>
		<Footer />
	</div>
);
