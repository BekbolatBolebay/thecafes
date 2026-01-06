"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/store'

interface RestaurantData {
  id?: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  is_active?: boolean;
  name_kk?: string;
  name_ru?: string;
  name_en?: string;
  description_kk?: string;
  description_ru?: string;
  description_en?: string;
}

interface RestaurantFormProps {
  initialData?: RestaurantData;
  isEditing: boolean;
}

export default function RestaurantForm({ initialData, isEditing }: RestaurantFormProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useApp()
  const [formData, setFormData] = useState<RestaurantData>(
    initialData || {
      name: '',
      description: '',
      image_url: '',
      category: '',
      is_active: true,
      name_kk: '',
      name_ru: '',
      name_en: '',
      description_kk: '',
      description_ru: '',
      description_en: '',
    }
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement
        setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
        setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || user?.role !== 'admin') {
      setError("Authentication required.")
      return
    }
    setIsSubmitting(true)
    setError(null)

    const url = isEditing ? `/api/admin/restaurants/${formData.id}` : '/api/admin/restaurants'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} restaurant`)
      }

      // Redirect to the list page on success
      router.push('/admin/restaurants')
      router.refresh() // Refreshes server components
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p>{error}</p></div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input type="text" name="image_url" id="image_url" value={formData.image_url} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
           <div className="flex items-center">
            <input type="checkbox" name="is_active" id="is_active" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Is Active</label>
          </div>
        </div>

        {/* Localized Fields */}
        <div className="space-y-4 bg-gray-50 p-4 rounded-md border">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Localization</h3>
          <div>
            <label htmlFor="name_kk" className="block text-sm font-medium text-gray-700">Name (Kazakh)</label>
            <input type="text" name="name_kk" id="name_kk" value={formData.name_kk || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
           <div>
            <label htmlFor="name_ru" className="block text-sm font-medium text-gray-700">Name (Russian)</label>
            <input type="text" name="name_ru" id="name_ru" value={formData.name_ru || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
           <div>
            <label htmlFor="name_en" className="block text-sm font-medium text-gray-700">Name (English)</label>
            <input type="text" name="name_en" id="name_en" value={formData.name_en || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="description_kk" className="block text-sm font-medium text-gray-700">Description (Kazakh)</label>
            <textarea name="description_kk" id="description_kk" value={formData.description_kk || ''} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          <div>
            <label htmlFor="description_ru" className="block text-sm font-medium text-gray-700">Description (Russian)</label>
            <textarea name="description_ru" id="description_ru" value={formData.description_ru || ''} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          <div>
            <label htmlFor="description_en" className="block text-sm font-medium text-gray-700">Description (English)</label>
            <textarea name="description_en" id="description_en" value={formData.description_en || ''} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button type="button" onClick={() => router.back()} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Restaurant'}
          </button>
        </div>
      </div>
    </form>
  )
}
