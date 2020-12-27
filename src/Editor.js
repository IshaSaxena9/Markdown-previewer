import React from "react";
import markdownToHTML from "./translator";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: "", html: "" };
  };

  componentDidMount() {
    let defaultInput = "# Welcome to my React Markdown Previewer!\n## This is a sub-heading...";
    // \n### And here's some other cool stuff:\n\nYou can make text **bold**... whoa!\nOr _italic_.\nOr... wait for it... **_both!_**\nAnd feel free to go crazy ~~crossing stuff out~~.\n\nThere's also [links](https://www.freecodecamp.com), and\n> Block Quotes!\n\n- And of course there are lists.\n\t- Some are bulleted.\n\t\t- With different indentation levels.\n\t\t\t- That look like this.\n\n![React Logo w/ Text](https://goo.gl/Umyytc)\n\nHeres some code, `<div></div>`, between 2 backticks.\n```\n// this is multi-line code:\nfunction anotherExample(firstLine, lastLine) {\n\tif (firstLine == '```' && lastLine == '```') {\n\t\treturn multiLineCode;\n\t}\n}\n```";
    const defaultHTML = markdownToHTML(defaultInput);
    this.setState({ input: defaultInput });
    document.getElementById("preview").innerHTML = defaultHTML;
  };

  handleChange = event => {
    this.setState({ input: event.target.value });
    document.getElementById("preview").innerHTML = markdownToHTML(event.target.value);
  };

  render() {
    return (
      <div>
        <textarea id="editor" rows="20" cols="80"
          value={this.state.input}
          onChange={this.handleChange} />
        <div id="preview">{this.state.html}</div>
      </div>
    );
  };
};

export default Editor;