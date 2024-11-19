import React, { useState, useEffect } from 'react'
import  JSONEditor  from './components/JSONEditor';
import FormPreview from './components/FormPreview'; 


import ErrorBoundary from './components/ErrorBoundary';

export interface FormField {
  id: string
  type: string
  label: string
  required: boolean
  placeholder?: string
  validation?: {
    pattern: string
    message: string
  }
  options?: Array<{
    value: string
    label: string
  }>
}

export interface FormSchema {
  formTitle: string
  formDescription: string
  fields: FormField[]
}

export default function App() {
  const [jsonSchema, setJsonSchema] = useState<FormSchema | null>(null)
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    darkModeMediaQuery.addEventListener('change', handleChange)

    return () => darkModeMediaQuery.removeEventListener('change', handleChange)
  }, [])

  const handleJsonChange = (json: string) => {
    setIsLoading(true)
    setJsonError(null)

    try {
      const parsedJson = JSON.parse(json) as FormSchema
      
      if (!parsedJson.formTitle || !parsedJson.formDescription || !Array.isArray(parsedJson.fields)) {
        throw new Error('Invalid JSON structure. Make sure formTitle, formDescription, and fields are present.')
      }

      setJsonSchema(parsedJson)
    } catch (error) {
      setJsonError('Invalid JSON: ' + (error as Error).message)
      setJsonSchema(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyJson = () => {
    if (jsonSchema) {
      navigator.clipboard.writeText(JSON.stringify(jsonSchema, null, 2))
      alert('JSON copied to clipboard!')
    }
  }

  const handleDownloadSubmission = () => {
    if (formData) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2))
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", "form_submission.json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    }
  }

  const handleFormSubmit = (data: any) => {
    setFormData(data)
    console.log(data)
    alert('Form submitted successfully!')
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className="flex flex-col h-screen lg:flex-row dark:bg-gray-800 dark:text-white">
          <div className="w-full lg:w-1/2 p-4 bg-gray-100 dark:bg-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">JSON Editor</h2>
              <button
                onClick={handleCopyJson}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={!jsonSchema}
              >
                Copy Form JSON
              </button>
            </div>
            <JSONEditor onChange={handleJsonChange} isDarkMode={isDarkMode} />
            {jsonError && <div className="text-red-500 mt-2">{jsonError}</div>}
          </div>
          <div className="w-full lg:w-1/2 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Form Preview</h2>
              <button
                onClick={handleDownloadSubmission}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                disabled={!formData}
              >
                Download Submission
              </button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <FormPreview schema={jsonSchema} onSubmit={handleFormSubmit} isDarkMode={isDarkMode} />
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}