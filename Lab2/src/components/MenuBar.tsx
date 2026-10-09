import { useState } from "react";
import Button from "./Button";

export type Tool = "Point" | "Line" | "Rectangle" | "Ellipse";
type MenuName = "file" | "objects" | "about";

const TOOLS: Tool[] = ["Point", "Line", "Rectangle", "Ellipse"];

interface MenuBarProps {
  onSelectTool: (tool: Tool) => void;
  onClear: () => void;
  onAbout: () => void;
}

export default function MenuBar({
  onSelectTool,
  onClear,
  onAbout,
}: MenuBarProps) {
  const [openMenu, setOpenMenu] = useState<MenuName | null>(null);

  const closeMenu = () => setOpenMenu(null);

  const toggle = (menu: MenuName) =>
    setOpenMenu(openMenu === menu ? null : menu);

  const hover = (menu: MenuName) => {
    if (openMenu) setOpenMenu(menu);
  };

  const run = (action: () => void) => {
    action();
    closeMenu();
  };

  const menuButton = (menu: MenuName, label: string) => (
    <Button
      className={`menu-button ${openMenu === menu ? "active" : ""}`}
      onClick={() => toggle(menu)}
      onMouseEnter={() => hover(menu)}
    >
      {label}
    </Button>
  );

  return (
    <>
      <div className="menu-bar">
        <div className="menu-item">
          {menuButton("file", "File")}
          {openMenu === "file" && (
            <div className="dropdown">
              <Button className="dropdown-item" onClick={() => run(onClear)}>
                Clear
              </Button>
            </div>
          )}
        </div>

        <div className="menu-item">
          {menuButton("objects", "Objects")}
          {openMenu === "objects" && (
            <div className="dropdown">
              {TOOLS.map((tool) => (
                <Button
                  key={tool}
                  className="dropdown-item"
                  onClick={() => run(() => onSelectTool(tool))}
                >
                  {tool}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="menu-item">
          {menuButton("about", "About")}
          {openMenu === "about" && (
            <div className="dropdown">
              <Button className="dropdown-item" onClick={() => run(onAbout)}>
                Show info
              </Button>
            </div>
          )}
        </div>
      </div>

      {openMenu && <div className="menu-overlay" onClick={closeMenu} />}
    </>
  );
}
