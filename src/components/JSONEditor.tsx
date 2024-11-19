import React, { useState, useEffect } from 'react';

interface JSONEditorProps {
  onChange: (json: string) => void;
  isDarkMode: boolean;
}

const JSONEditor: React.FC<JSONEditorProps> = ({ onChange, isDarkMode }) => {
  const [jsonText, setJsonText] = useState('');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onChange(jsonText);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [jsonText, onChange]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(event.target.value);
  };

  return (
    <textarea
      className={`w-full h-[calc(100vh-8rem)] p-2 font-mono text-sm border rounded ${
        isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-black border-gray-300'
      }`}
      value={jsonText}
      onChange={handleChange}
      placeholder="Enter your JSON schema here..."
    />
  );
};

// Ensure the component is properly exported
export default JSONEditor;
