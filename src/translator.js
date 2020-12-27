const markdownToHTML = markdownString => {
  let newString = markdownString.split("");
  let hashCount = 0;
  for(let i=0; i<newString.length; i++) {
    let char = newString[i];

    // replacing hashes with heading tags
    if(char === "#") {
      hashCount++;
      let nextChar = newString[i+1];
      if(nextChar && nextChar === "#") {
        continue;
      };
      if(char === "#" && nextChar === " ") {
        newString.splice(i-(hashCount-1), hashCount+1, `<h${hashCount}>`);
      };
    };
    if(i === newString.length-1) {
      if(hashCount) {
        newString.splice(i+1, 0, `</h${hashCount}>`);
        hashCount = 0;
      };
    };
    if(char === "\n") {
      if(hashCount) {
        newString.splice(i, 1, `</h${hashCount}>`);
        hashCount = 0;
      };
    };
  };
  return newString.join("");
};

export default markdownToHTML;