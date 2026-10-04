import React from "react";
import { createRoot } from "react-dom/client";
import "../index.css";

class Module1Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedIndex: -1 };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleExit = this.handleExit.bind(this);
  }

  handleSelect(index) {
    this.setState({ selectedIndex: index });
  }

  handleConfirm() {
    const { groups } = this.props;
    const { selectedIndex } = this.state;
    if (selectedIndex < 0) return;
    this.props.onClose(groups[selectedIndex]);
  }

  handleExit() {
    this.props.onClose(null);
  }

  render() {
    const { groups } = this.props;
    const { selectedIndex } = this.state;

    return (
      <div className="m1-overlay">
        <div className="m1-dialog">
          <div className="m1-titlebar" id="m1-title">
            Group selection
          </div>
          <div className="m1-body">
            <p className="m1-label">choose group from the list:</p>
            <ul className="m1-listbox">
              {groups.map((group, index) => (
                <li
                  key={group}
                  className={index === selectedIndex ? "selected" : ""}
                  onClick={() => this.handleSelect(index)}
                >
                  {group}
                </li>
              ))}
            </ul>
          </div>
          <div className="m1-actions">
            <button type="button" className="m1-btn" onClick={this.handleExit}>
              Exit
            </button>
            <button
              type="button"
              className="m1-btn m1-btn-primary"
              onClick={this.handleConfirm}
              disabled={selectedIndex < 0}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export function selectDialog(container, groups = []) {
  return new Promise((resolve) => {
    const host = document.createElement("div");
    container.appendChild(host);
    const root = createRoot(host);

    const close = (result) => {
      root.unmount();
      container.removeChild(host);
      resolve(result);
    };

    root.render(<Module1Dialog groups={groups} onClose={close} />);
  });
}
