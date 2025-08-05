import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import { buildUrl } from "../../features/memos";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends Component<
  Props & { navigate: ReturnType<typeof useNavigate> },
  State
> {
  constructor(props: Props & { navigate: ReturnType<typeof useNavigate> }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleGoHome = () => {
    this.setState({ hasError: false });
    this.props.navigate(buildUrl.list());
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-8">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <Button onClick={this.handleGoHome}>Back to memos</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  return (
    <ErrorBoundaryClass navigate={navigate}>{children}</ErrorBoundaryClass>
  );
};
