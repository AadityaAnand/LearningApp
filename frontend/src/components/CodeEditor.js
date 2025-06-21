import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

const LANGUAGE_OPTIONS = [
  { label: 'JavaScript', value: 'javascript', defaultCode: '// Write your JavaScript code here\n' },
  { label: 'HTML', value: 'html', defaultCode: '<!-- Write your HTML here -->\n' },
  { label: 'CSS', value: 'css', defaultCode: '/* Write your CSS here */\n' },
  { label: 'Java', value: 'java', defaultCode: '// Write your Java code here\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}\n' },
  { label: 'C++', value: 'cpp', defaultCode: '// Write your C++ code here\n#include <iostream>\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}\n' },
  { label: 'Python', value: 'python', defaultCode: '# Write your Python code here\nprint("Hello, World!")\n' },
];

const getStorageKey = (lessonId, language) => `code_${lessonId}_${language}`;

const CodeEditor = ({ lessonId }) => {
  const [language, setLanguage] = useState(LANGUAGE_OPTIONS[0].value);
  const [code, setCode] = useState('');

  // Load code from localStorage or use default
  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(lessonId, language));
    if (saved !== null) {
      setCode(saved);
    } else {
      const langObj = LANGUAGE_OPTIONS.find(l => l.value === language);
      setCode(langObj ? langObj.defaultCode : '');
    }
  }, [lessonId, language]);

  // Save code to localStorage on change
  const handleCodeChange = (value) => {
    setCode(value);
    localStorage.setItem(getStorageKey(lessonId, language), value);
  };

  // Manual save button (optional)
  const handleSave = () => {
    localStorage.setItem(getStorageKey(lessonId, language), code);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2 gap-2">
        <label htmlFor="language-select" className="font-medium">Language:</label>
        <select
          id="language-select"
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {LANGUAGE_OPTIONS.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
        <button
          onClick={handleSave}
          className="ml-2 px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm"
        >
          Save
        </button>
      </div>
      <div className="border rounded shadow">
        <MonacoEditor
          height="350px"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={handleCodeChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor; 