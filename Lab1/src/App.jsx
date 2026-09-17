import React from "react";
import { selectDialog } from "./modules/Module1";
import { inputDialog } from "./modules/Module2";
import "./index.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { output: "Choose work1 or work2" };
    this.hostRef = React.createRef();
    this.runWork1 = this.runWork1.bind(this);
    this.runWork2 = this.runWork2.bind(this);
  }

  async runWork1() {
    const groups = ["ІО-32", "ІМ-41", "ІО-42", "ІМ-53", "ІП-22"];
    const selected = await selectDialog(this.hostRef.current, groups);
    this.setState({
      output: selected
        ? `Choosed group: ${selected}`
        : "You didn't choose the group",
    });
  }

  async runWork2() {
    const text = await inputDialog(this.hostRef.current);
    this.setState({
      output: text ? `${text}` : "no text was entered",
    });
  }

  render() {
    return (
      <div className="app">
        <header className="menubar">
          <button className="menu-item" onClick={this.runWork1}>
            Work1
          </button>
          <button className="menu-item" onClick={this.runWork2}>
            Work2
          </button>
        </header>

        <main className="workspace">
          <div className="output-panel">
            <pre className="output">{this.state.output}</pre>
          </div>
        </main>

        <div ref={this.hostRef} className="dialog-host" />
      </div>
    );
  }
}

export default App;
