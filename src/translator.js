const markdownToHTML = markdownString => {
  let newString = markdownString.split("");
  let hashCount = 0, starCount = 0, _count = 0, strikeCount = 0, tickCount = 0;
  let setBold = false, setItalic = false, setStrike = false, openCodeBlock = false, openPre = false;
  let openAnchorTag = false, linkText = "", openLink = false, linkHref = "", openBlockQuote = false;
  let openList = false, tabCount = 0;

  for (let i = 0; i < newString.length; i++) {
    let char = newString[i];
    let nextChar = newString[i + 1];
    let prevChar = newString[i - 1];

    if (i === newString.length - 1) {
      if (hashCount) {
        newString.splice(i + 1, 0, `</h${hashCount}>`);
        hashCount = 0;
      } else if (openBlockQuote) {
        newString.splice(i + 1, 0, `</blockquote>`);
        openBlockQuote = false;
      } else if (openList) {
        newString.splice(i + 1, 0, `</li></ul>`);
        openList = false;
      };
    };
    if (char === "\n") {
      if (hashCount) {
        newString.splice(i, 1, `</h${hashCount}>`);
        hashCount = 0;
      } else if (openBlockQuote && nextChar !== ">") {
        newString.splice(i, 1, `</blockquote>`);
        openBlockQuote = false;
      } else if (openList) {
        if (nextChar === "-" || nextChar === "\t") {
          newString.splice(i, 1, `</li>`);
        } else {
          newString.splice(i, 1, `</li></ul>`);
          openList = false;
        };
      } else {
        newString.splice(i, 1, `<br />`);
      };
    };
    if (char === "<") {
      newString.splice(i, 1, `&lt;`);
    };
    if (char === ">") {
      if (openCodeBlock) {
        newString.splice(i, 1, `&gt;`);
      } else if (openBlockQuote) {
        newString.splice(i, 1);
      } else {
        newString.splice(i, 1, `<blockquote>`);
        openBlockQuote = true;
      };
    };
    // replacing hashes with heading tags
    if (char === "#") {
      hashCount++;
      if (nextChar && nextChar === "#") {
        continue;
      };
      if (nextChar === " ") {
        newString.splice(i - (hashCount - 1), hashCount + 1, `<h${hashCount}>`);
        i = i - (hashCount - 1);
      };
    };

    if (char === "*") {
      if (setBold) {
        newString.splice(i, starCount, `</b>`);
        starCount = 0;
        setBold = false;
        continue;
      };
      starCount++;
      if (nextChar && nextChar === "*") {
        continue;
      };
      if ((/\w/).test(nextChar) && starCount == 2) {
        newString.splice(i - 1, starCount, `<b>`);
        setBold = true;
        i = i - (starCount - 1);
      };
    };

    if (char === "_") {
      if (setItalic) {
        newString.splice(i, 1, `</i>`);
        _count = 0;
        setItalic = false;
        continue;
      };
      _count++;
      if (nextChar && nextChar === "_") {
        continue;
      };
      if ((/\w/).test(nextChar) && _count == 1) {
        newString.splice(i, 1, `<i>`);
        setItalic = true;
      };
    };

    if (char === "~") {
      if (setStrike) {
        newString.splice(i, strikeCount, `</del>`);
        strikeCount = 0;
        setStrike = false;
        continue;
      };
      strikeCount++;
      if (nextChar && nextChar === "~") {
        continue;
      };
      if ((/\w/).test(nextChar) && strikeCount == 2) {
        newString.splice(i - 1, strikeCount, `<del>`);
        setStrike = true;
        i = i - (strikeCount - 1);
      };
    };

    if (char === "-" && nextChar === " ") {
      if (prevChar === "\t") {
        let newTabCount = 0;
        let j = i - 1;
        while (j >= 0 && newString[j] === "\t") {
          newTabCount++;
          j--;
        };
        if (newTabCount < tabCount) {
          newString.splice(i - newTabCount, newTabCount + 1, `</ul><li>`);
        } else if (newTabCount > tabCount) {
          newString.splice(i - newTabCount, newTabCount + 1, `<ul><li>`);
        } else {
          newString.splice(i-tabCount, tabCount+1, `<li>`);
        };
        tabCount = newTabCount;
      } else if (tabCount) {
        newString.splice(i, 1, `</ul><li>`);
        tabCount = 0;
      } else if (openList) {
        newString.splice(i, 1, `<li>`);
      } else {
        newString.splice(i, 1, `<ul><li>`);
        openList = true;
      };
    };

    if (char === "`") {
      if (openCodeBlock) {
        if (openPre) {
          newString.splice(i, tickCount, `</code></pre>`);
          openPre = false;
        } else {
          newString.splice(i, 1, `</code>`);
        };
        tickCount = 0;
        openCodeBlock = false;
        continue;
      };
      tickCount++;
      if (nextChar && nextChar === "`") {
        continue;
      };
      if (tickCount === 1) {
        newString.splice(i, tickCount, `<code id="code-block">`);
        openCodeBlock = true;
      };
      if (tickCount === 3) {
        newString.splice(i - (tickCount - 1), tickCount + 1, `<pre><code>`);
        openCodeBlock = true;
        openPre = true;
        i = i - (tickCount - 1);
      };
    };

    if (char === "[" && (/\w/).test(nextChar)) {
      openAnchorTag = true;
      continue;
    };

    if (char === "(" && (/\w/).test(nextChar) && openAnchorTag) {
      openAnchorTag = false;
      openLink = true;
      continue;
    };

    if (char === ")" && openLink) {
      openLink = false;
      let linkLength = linkText.length + linkHref.length + 4;
      newString.splice(i - (linkLength - 1), linkLength, `<a href=${linkHref} target="_blank">${linkText}</a>`);
      i = i - (linkLength - 1);
      continue;
    };

    if (openAnchorTag && char !== "]") {
      linkText = linkText.concat(char);
      continue;
    };

    if (openLink) {
      linkHref = linkHref.concat(char);
      continue;
    };
  };
  return newString.join("");
};

export default markdownToHTML;