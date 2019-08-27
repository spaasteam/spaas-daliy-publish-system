import mdtoc from "fe-markdown-toc";

const start = "<!-- toc -->\n";
const stop = "\n<!-- toc stop -->";
const clean = /<!-- toc -->[\s\S]+<!-- toc stop -->/;

const toc = content => {
  // Remove the existing TOC
  content = content.replace(clean, start);

  // Generate the new TOC
  var table = start + mdtoc(content) + stop;

  content = content.replace(start, table);

  return content;
};

export default toc;
