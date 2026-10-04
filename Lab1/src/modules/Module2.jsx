import React from "react";
import { createRoot } from "react-dom/client";
import "../index.css";

class Module2Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleExit = this.handleExit.bind(this);
  }

  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  handleConfirm() {
    const trimmed = this.state.text.trim();
    if (!trimmed) return;
    this.props.onClose(trimmed);
  }

  handleExit() {
    this.props.onClose(null);
  }

  render() {
    const { text } = this.state;

    return (
      <div className="m2-overlay">
        <div className="m2-dialog">
          <div className="m2-titlebar" id="m2-title">
            Work2
          </div>
          <div className="m2-body">
            <p className="m2-label">Input your text:</p>
            <input
              type="text"
              className="m2-edit"
              value={text}
              onChange={this.handleChange}
              autoFocus
            />
          </div>
          <div className="m2-actions">
            <button type="button" className="m2-btn" onClick={this.handleExit}>
              Exit
            </button>
            <button
              type="button"
              className="m2-btn m2-btn-primary"
              onClick={this.handleConfirm}
              disabled={!text.trim()}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export function inputDialog(container) {
  return new Promise((resolve) => {
    const host = document.createElement("div");
    container.appendChild(host);
    const root = createRoot(host);

    const close = (result) => {
      root.unmount();
      container.removeChild(host);
      resolve(result);
    };

    root.render(<Module2Dialog onClose={close} />);
  });
}
