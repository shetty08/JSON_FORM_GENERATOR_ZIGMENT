import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h2 className="text-lg font-bold mb-2">Oops, something went wrong!</h2>
          <p>We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      )
    }

    return this.props.children;
  }
}

export default ErrorBoundary;