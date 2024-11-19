import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FormPreview from './components/FormPreview'
import { FormSchema, FormField } from './App'

const mockSchema: FormSchema = {
  formTitle: 'Test Form',
  formDescription: 'Please fill out the form',
  fields: [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your name'
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email',
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        message: 'Please enter a valid email address'
      }
    }
  ]
}

describe('FormPreview Component', () => {
  test('renders form title and description', () => {
    render(<FormPreview schema={mockSchema} onSubmit={jest.fn()} isDarkMode={false} />)

    
    expect(screen.getByText('Test Form')).toBeInTheDocument()

   
    expect(screen.getByText('Please fill out the form')).toBeInTheDocument()
  })

  test('renders input fields', () => {
    render(<FormPreview schema={mockSchema} onSubmit={jest.fn()} isDarkMode={false} />)

    
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
  })

  test('shows validation error on invalid email input', async () => {
    render(<FormPreview schema={mockSchema} onSubmit={jest.fn()} isDarkMode={false} />)

    
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'invalidemail' } })

   
    fireEvent.click(screen.getByRole('button'))

   
    await waitFor(() => expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument())
  })

  test('disables submit button if form is invalid', () => {
    render(<FormPreview schema={mockSchema} onSubmit={jest.fn()} isDarkMode={false} />)

    
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: '' } })

   
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('enables submit button when form is valid', () => {
    render(<FormPreview schema={mockSchema} onSubmit={jest.fn()} isDarkMode={false} />)

    
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john.doe@example.com' } })

    
    expect(screen.getByRole('button')).toBeEnabled()
  })

  test('calls onSubmit when form is valid and submitted', () => {
    const mockSubmit = jest.fn()

    render(<FormPreview schema={mockSchema} onSubmit={mockSubmit} isDarkMode={false} />)

   
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john.doe@example.com' } })

    
    fireEvent.click(screen.getByRole('button'))

    
    expect(mockSubmit).toHaveBeenCalledTimes(1)
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john.doe@example.com'
    })
  })
})
