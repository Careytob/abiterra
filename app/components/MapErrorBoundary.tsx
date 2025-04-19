// app/components/MapErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class MapErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Map error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="h-64 w-full flex items-center justify-center bg-gray-200 rounded-lg"
          aria-label="Map error"
        >
          <p className="text-gray-600">Failed to load map.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default MapErrorBoundary;