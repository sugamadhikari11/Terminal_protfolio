"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
};

/** Isolates R3F/canvas failures from the cube shell so ModeCube stays usable. */
export default class GuiErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-dvh w-full flex-col items-center justify-center gap-3 bg-[#050805] px-6 text-center font-mono">
          <p className="text-sm tracking-[0.25em] text-red-400">GUI SCENE FAILED</p>
          <p className="max-w-md text-xs leading-relaxed text-zinc-400">
            {this.state.error.message}
          </p>
          <button
            type="button"
            className="mt-2 border border-emerald-700 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-emerald-400 hover:border-emerald-400"
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
