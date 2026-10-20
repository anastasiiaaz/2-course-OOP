import { Component } from "react";
import Button from "./Button";

export type Tool = "Point" | "Line" | "Rectangle" | "Ellipse";
type MenuName = "file" | "objects" | "help";

export const TOOLS: Tool[] = ["Point", "Line", "Rectangle", "Ellipse"];

interface MenuBarProps {
  onSelectTool: (tool: Tool) => void;
  onClear: () => void;
  onAbout: () => void;
  onInitMenuPopup: () => Tool;
}

interface MenuBarState {
  openMenu: MenuName | null;
  checkedTool: Tool | null;
}

export default class MenuBar extends Component<MenuBarProps, MenuBarState> {
  state: MenuBarState = { openMenu: null, checkedTool: null };

  openPopup(menu: MenuName) {
    const checkedTool =
      menu === "objects" ? this.props.onInitMenuPopup() : null;
    this.setState({ openMenu: menu, checkedTool });
  }

  closeMenu = () => this.setState({ openMenu: null });

  toggle = (menu: MenuName) => {
    if (this.state.openMenu === menu) this.closeMenu();
    else this.openPopup(menu);
  };

  hover = (menu: MenuName) => {
    if (this.state.openMenu) this.openPopup(menu);
  };

  run = (action: () => void) => {
    action();
    this.closeMenu();
  };

  menuButton(menu: MenuName, label: string) {
    return (
      <Button
        className={`menu-button ${this.state.openMenu === menu ? "active" : ""}`}
        onClick={() => this.toggle(menu)}
        onMouseEnter={() => this.hover(menu)}
      >
        {label}
      </Button>
    );
  }

  render() {
    const { openMenu, checkedTool } = this.state;
    const { onSelectTool, onClear, onAbout } = this.props;

    return (
      <>
        <div className="menu-bar">
          <div className="menu-item">
            {this.menuButton("file", "File")}
            {openMenu === "file" && (
              <div className="dropdown">
                <Button
                  className="dropdown-item"
                  onClick={() => this.run(onClear)}
                >
                  <img className="menu-icon" src="/icons/clear.png" alt="" />
                  Clear
                </Button>
              </div>
            )}
          </div>

          <div className="menu-item">
            {this.menuButton("objects", "Objects")}
            {openMenu === "objects" && (
              <div className="dropdown">
                {TOOLS.map((tool) => (
                  <Button
                    key={tool}
                    className="dropdown-item"
                    onClick={() => this.run(() => onSelectTool(tool))}
                  >
                    <span className="check">
                      {checkedTool === tool ? "✓" : ""}
                    </span>
                    {tool}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="menu-item">
            {this.menuButton("help", "Help")}
            {openMenu === "help" && (
              <div className="dropdown">
                <Button
                  className="dropdown-item"
                  onClick={() => this.run(onAbout)}
                >
                  <img className="menu-icon" src="/icons/info.png" alt="" />
                  About
                </Button>
              </div>
            )}
          </div>
        </div>

        {openMenu && <div className="menu-overlay" onClick={this.closeMenu} />}
      </>
    );
  }
}
