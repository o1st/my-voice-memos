import React from "react";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="min-h-screen flex flex-col bg-white">
    <Header />
    <main className="flex-1 max-w-3xl mx-auto px-4 py-6">{children}</main>
    <Footer />
  </div>
);
