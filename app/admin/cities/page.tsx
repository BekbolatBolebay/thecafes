// ============================================================================
// ADMIN CITIES MANAGEMENT PAGE
// ============================================================================
// Location: app/admin/cities/page.tsx
// Purpose: Manage cities (Super Admin only)
// ============================================================================

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Edit2, Trash2, Building2, AlertTriangle } from "lucide-react"
import { useAdmin, usePermission, useDemoMode } from "@/lib/admin-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface City {
  id: string
  name: string
  state: string
  isActive: boolean
  cafeCount?: number
}

export default function AdminCitiesPage() {
  const router = useRouter()
  const { adminUser, isAuthenticated } = useAdmin()
  const canManageCities = usePermission("MANAGE_CITIES")
  const { demoModeEnabled: demoMode } = useDemoMode()
  const [cities, setCities] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newCityName, setNewCityName] = useState("")
  const [newCityState, setNewCityState] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !adminUser) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, adminUser, router])

  // Check permissions
  useEffect(() => {
    if (!canManageCities) {
      router.push("/admin/dashboard")
    }
  }, [canManageCities, router])

  // Load cities (mock data for now)
  useEffect(() => {
    const loadCities = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with actual API call
        // const response = await fetch('/api/admin/cities', {
        //   headers: {
        //     'Authorization': `Bearer ${sessionToken}`
        //   }
        // })
        // const data = await response.json()
        // setCities(data)

        // Mock data
        setCities([
          { id: "1", name: "Kyzylorda", state: "Kyzylorda", isActive: true, cafeCount: 5 },
          { id: "2", name: "Almaty", state: "Almaty", isActive: true, cafeCount: 12 },
        ])
      } catch (error) {
        console.error("Failed to load cities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (canManageCities) {
      loadCities()
    }
  }, [canManageCities])

  const handleAddCity = async () => {
    if (!newCityName.trim() || !newCityState.trim()) {
      alert("Please fill in all fields")
      return
    }

    setIsAdding(true)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/cities', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${sessionToken}`
      //   },
      //   body: JSON.stringify({ name: newCityName, state: newCityState })
      // })

      // Mock add
      setCities([
        ...cities,
        {
          id: Date.now().toString(),
          name: newCityName,
          state: newCityState,
          isActive: true,
          cafeCount: 0,
        },
      ])

      setNewCityName("")
      setNewCityState("")
    } catch (error) {
      console.error("Failed to add city:", error)
      alert("Failed to add city")
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteCity = async (cityId: string) => {
    if (demoMode) {
      alert("Deleting cities is restricted in demo mode")
      return
    }

    if (!confirm("Are you sure you want to delete this city?")) {
      return
    }

    try {
      // TODO: Replace with actual API call
      setCities(cities.filter((city) => city.id !== cityId))
    } catch (error) {
      console.error("Failed to delete city:", error)
      alert("Failed to delete city")
    }
  }

  if (!isAuthenticated || !adminUser || !canManageCities) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-slate-600 hover:text-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-lg text-slate-900">Manage Cities</h1>
              <p className="text-xs text-slate-500">{cities.length} cities</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Demo Mode Warning */}
        {demoMode && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-300">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Demo mode enabled. Deletions are restricted.
            </AlertDescription>
          </Alert>
        )}

        {/* Add City Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New City
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              placeholder="City name (e.g., Almaty)"
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-accent"
            />

            <input
              type="text"
              value={newCityState}
              onChange={(e) => setNewCityState(e.target.value)}
              placeholder="State/Region"
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-accent"
            />

            <Button
              onClick={handleAddCity}
              disabled={isAdding}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              {isAdding ? "Adding..." : "Add City"}
            </Button>
          </div>
        </div>

        {/* Cities List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading cities...</div>
          ) : cities.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No cities yet. Add your first city above.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">City</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Region</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Cafes</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {cities.map((city) => (
                    <tr key={city.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{city.name}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{city.state}</td>
                      <td className="px-6 py-4 text-slate-600">{city.cafeCount || 0}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          {city.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-2">
                        <button className="p-1 hover:bg-slate-100 rounded transition">
                          <Edit2 className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteCity(city.id)}
                          disabled={demoMode}
                          className="p-1 hover:bg-slate-100 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
