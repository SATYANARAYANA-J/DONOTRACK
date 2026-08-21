import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // log to console and keep stack for display
    console.error("ErrorBoundary caught:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 32,
          fontFamily: "Inter, system-ui, Arial",
          color: "#111827",
          background: "#fff7ed",
          minHeight: "100vh"
        }}>
          <h1 style={{ marginTop: 0 }}>App crashed — runtime error</h1>
          <p style={{ marginBottom: 8, color: "#7c2d12" }}>
            The app encountered an error while rendering. The stack trace is shown below.
          </p>
          <pre style={{
            whiteSpace: "pre-wrap",
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
            padding: 12,
            borderRadius: 8,
            color: "#1f2937",
            overflowX: "auto"
          }}>
            {this.state.error && this.state.error.toString()}
            {"\n"}
            {this.state.info && this.state.info.componentStack}
          </pre>

          <div style={{ marginTop: 12 }}>
            <strong>Next steps:</strong>
            <ol>
              <li>Open devtools Console — you'll see the same stack. Copy & paste the top error here if you want me to fix it.</li>
              <li>If this happened after editing a file, revert that change to isolate the problem.</li>
            </ol>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
