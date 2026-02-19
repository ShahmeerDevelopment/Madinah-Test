// import * as esprima from "esprima";
// import estraverse from "estraverse";

// export const validateScript = (scriptCode) => {
//   try {
//     const ast = esprima.parseScript(scriptCode);
//     let isValid = true;

//     estraverse.traverse(ast, {
//       enter: function (node) {
//         if (
//           node.type === "WhileStatement" ||
//           node.type === "DoWhileStatement" ||
//           node.type === "ForStatement"
//         ) {
//           if (isInfiniteLoop(node)) {
//             isValid = false;
//             this.break();
//           }
//         }
//         if (node.type === "CallExpression") {
//           if (
//             node.callee &&
//             (node.callee.name === "eval" || node.callee.name === "Function")
//           ) {
//             isValid = false;
//             this.break();
//           }
//         }
//         if (node.type === "Identifier") {
//           if (["document", "window"].includes(node.name)) {
//             isValid = false;
//             this.break();
//           }
//         }
//       },
//     });

//     return isValid;
//   } catch (e) {
//     // Parsing error
//     return false;
//   }
// };

// const isInfiniteLoop = (node) => {
//   if (
//     (node.type === "WhileStatement" || node.type === "DoWhileStatement") &&
//     node.test.type === "Literal" &&
//     node.test.value === true
//   ) {
//     return true;
//   }
//   if (node.type === "ForStatement" && !node.test) {
//     return true;
//   }
//   return false;
// };

import * as esprima from "esprima";
import estraverse from "estraverse";

export const validateScript = (scriptCode) => {
  try {
    // Regular expressions to match <script> tags
    const scriptTagRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    const srcScriptTagRegex =
      /<script\b[^>]*src=['"]([^'"]+)['"][^>]*>\s*<\/script>/gi;

    let isValid = true;
    let hasScriptTag = false;

    // Check for script tags with src attribute
    if (srcScriptTagRegex.test(scriptCode)) {
      hasScriptTag = true;
      // Accept script tags with src attribute
      // Optionally, you can add logic to validate the src URL
      scriptCode = scriptCode.replace(srcScriptTagRegex, "");
    }

    // Check for script tags with inline code
    let match;
    while ((match = scriptTagRegex.exec(scriptCode)) !== null) {
      hasScriptTag = true;
      const innerCode = match[1];
      if (innerCode.trim() !== "") {
        // Validate the inner JavaScript code
        if (!validateJavaScript(innerCode)) {
          isValid = false;
          break;
        }
      }
      // Remove the script tag from scriptCode to prevent re-processing
      scriptCode = scriptCode.replace(match[0], "");
    }

    // If there was no script tag, validate the whole input as JavaScript
    if (!hasScriptTag) {
      if (!validateJavaScript(scriptCode)) {
        isValid = false;
      }
    }

    return isValid;
  } catch (e) {
    // Parsing error
    return false;
  }
};

const validateJavaScript = (code) => {
  try {
    const ast = esprima.parseScript(code);
    let isValid = true;

    estraverse.traverse(ast, {
      enter: function (node) {
        if (
          node.type === "WhileStatement" ||
          node.type === "DoWhileStatement" ||
          node.type === "ForStatement"
        ) {
          if (isInfiniteLoop(node)) {
            isValid = false;
            this.break();
          }
        }
        if (node.type === "CallExpression") {
          if (
            node.callee &&
            (node.callee.name === "eval" || node.callee.name === "Function")
          ) {
            isValid = false;
            this.break();
          }
        }
        if (node.type === "Identifier") {
          if (["document", "window"].includes(node.name)) {
            isValid = false;
            this.break();
          }
        }
      },
    });

    return isValid;
  } catch (e) {
    // Parsing error
    return false;
  }
};

const isInfiniteLoop = (node) => {
  if (
    (node.type === "WhileStatement" || node.type === "DoWhileStatement") &&
    node.test.type === "Literal" &&
    node.test.value === true
  ) {
    return true;
  }
  if (node.type === "ForStatement" && !node.test) {
    return true;
  }
  return false;
};
