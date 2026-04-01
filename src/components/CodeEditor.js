import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

const CodeEditor = ({ value, onChange, placeholder }) => {
  return (
    <div className="code-editor">
      <CodeMirror
        value={value}
        height="400px"
        theme={oneDark}
        extensions={[python()]}
        onChange={(val) => onChange(val)}
        placeholder={placeholder}
        options={{
          lineNumbers: true,
          lineWrapping: true,
          indentUnit: 4,
          tabSize: 4,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightSelectionMatches: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
