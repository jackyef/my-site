import { Component, type ReactNode } from 'react';

type Props = {
  onError: () => void;
  children: ReactNode;
};

type State = {
  failed: boolean;
};

/**
 * WebGL is the one part of this page that can fail on a visitor's machine
 * for reasons we can't predict — a lost context, a blocked driver, an
 * out-of-memory tab. If the scene throws, we hand the page back to the
 * plain-text resume rather than showing a blank rectangle.
 */
export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
