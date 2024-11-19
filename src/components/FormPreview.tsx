import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { FormSchema, FormField } from '../App'

interface FormPreviewProps {
  schema: FormSchema | null
  onSubmit: (data: any) => void
  isDarkMode: boolean
}

const FormPreview: React.FC<FormPreviewProps> = ({ schema, onSubmit, isDarkMode }) => {
  const { register, handleSubmit, formState: { errors, isValid, isDirty, dirtyFields } } = useForm({ mode: 'onChange' })

  const handleFormSubmit: SubmitHandler<any> = (data) => {
    onSubmit(data)
  }

  if (!schema) {
    return <div>No valid schema provided</div>
  }

  const renderField = (field: FormField) => {
    const isFieldDirty = dirtyFields[field.id]
    const fieldError = errors[field.id]

    const baseInputClasses = `mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${
      isDarkMode
        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-300 focus:ring-blue-200'
        : 'bg-white border-gray-300 text-black focus:border-blue-300 focus:ring-blue-200'
    }`

    const validationPreview = isFieldDirty ? (
      fieldError ? (
        <p className="mt-1 text-sm text-red-500">{fieldError.message as string || 'This field is invalid'}</p>
      ) : (
        <p className="mt-1 text-sm text-green-500">Field is valid</p>
      )
    ) : null

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <>
            <input
              type={field.type}
              id={field.id}
              {...register(field.id, {
                required: field.required,
                pattern: field.validation ? {
                  value: new RegExp(field.validation.pattern),
                  message: field.validation.message
                } : undefined
              })}
              className={`${baseInputClasses} ${fieldError ? 'border-red-500' : isFieldDirty ? 'border-green-500' : ''}`}
              placeholder={field.placeholder}
            />
            {validationPreview}
          </>
        )
      case 'select':
        return (
          <>
            <select
              id={field.id}
              {...register(field.id, { required: field.required })}
              className={`${baseInputClasses} ${fieldError ? 'border-red-500' : isFieldDirty ? 'border-green-500' : ''}`}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {validationPreview}
          </>
        )
      case 'radio':
        return (
          <>
            <div className="mt-1 space-y-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`${field.id}-${option.value}`}
                    value={option.value}
                    {...register(field.id, { required: field.required })}
                    className={`focus:ring-opacity-50 h-4 w-4 ${isDarkMode ? 'text-blue-600 border-gray-600' : 'text-blue-600 border-gray-300'}`}
                  />
                  <label htmlFor={`${field.id}-${option.value}`} className="ml-2 block text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {validationPreview}
          </>
        )
      case 'textarea':
        return (
          <>
            <textarea
              id={field.id}
              {...register(field.id, { required: field.required })}
              className={`${baseInputClasses} ${fieldError ? 'border-red-500' : isFieldDirty ? 'border-green-500' : ''}`}
              placeholder={field.placeholder}
            />
            {validationPreview}
          </>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <h1 className="text-2xl font-bold">{schema.formTitle}</h1>
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{schema.formDescription}</p>
      {schema.fields.map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {field.label}
          </label>
          {renderField(field)}
        </div>
      ))}
      <button
        type="submit"
        disabled={!isValid || !isDirty}
        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
          isValid && isDirty
            ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Submit
      </button>
    </form>
  )
}
export{};

export default FormPreview; // Ensure default export
