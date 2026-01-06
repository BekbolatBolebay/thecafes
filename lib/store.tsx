"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSupabase } from "./supabase"
import { authenticate, AuthResult, UserRole } from "./auth-service"
import type { Language } from "./translations"

// Types
export interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
  deliveryTime: string
  categories: string[]
  description?: string
  distance?: string
  badges?: string[]
  address?: string
  reviewCount?: number
}

export interface Category {
  id: string
  name:string
  icon: string
  image: string
}

export interface FoodItem {
  id: string
  name: string
  image: string
  price: number
  description: string
  restaurant: string
  restaurantId: string
  rating: number
  deliveryTime: string
  categories: string[]
  discount?: number
}

export interface CartItem extends FoodItem {
  quantity: number
}

export interface Booking {
  id:string
  restaurant_name: string
  booking_date: string
  booking_time: string
  number_of_guests: number
  restaurant_image?: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  city: string
  address?: string
  avatar?: string
  role: UserRole
}

interface AppState {
  user: User | null
  cart: CartItem[]
  bookings: Booking[]
  favorites: Set<string>
  location: string
  searchQuery: string
  isAuthenticated: boolean
  isAuthLoading: boolean
  theme: "light" | "dark"
  language: Language
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<AuthResult>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<boolean>
  addToCart: (item: FoodItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleFavorite: (itemId: string) => void
  setLocation: (location: string) => void
  setSearchQuery: (query: string) => void
  getCartTotal: () => number
  getCartCount: () => number
  toggleTheme: () => void
  setLanguage: (lang: Language) => void
  getBookings: () => Booking[]
  removeBooking: (bookingId: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    cart: [],
    bookings: [],
    favorites: new Set(),
    location: "Қызылорда",
    searchQuery: "",
    isAuthenticated: false,
    isAuthLoading: true, // Start with loading state
    theme: "light",
    language: "kk",
  })

  // Load from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      let initialSate: Partial<AppState> = {}
      try {
        const savedState = localStorage.getItem("foodDeliveryState")
        if (savedState) {
          const parsed = JSON.parse(savedState)
          initialSate = {
            cart: Array.isArray(parsed.cart) ? parsed.cart : [],
            favorites: new Set(parsed.favorites || []),
            location: typeof parsed.location === "string" ? parsed.location : "Қызылорда",
            theme: parsed.theme === "dark" ? "dark" : "light",
            language: ["kk", "ru", "en"].includes(parsed.language) ? parsed.language : "kk",
          }
        }
      } catch (error) {
        console.error("Error loading state from localStorage:", error)
      }
      
      setState((prev) => ({...prev, ...initialSate}))

      // Check Supabase session
      try {
        const supabaseClient = getSupabase()
        const { data, error } = await supabaseClient.auth.getSession()
        if (error) throw error

        const sessionUser = data?.session?.user
        if (sessionUser?.id) {
          // Fetch user profile from public.users table
          const { data: userData, error: profileError } = await supabaseClient
            .from("users")
            .select("id, full_name, email, phone, city, address, role")
            .eq("id", sessionUser.id)
            .single()

          if (profileError) throw new Error("User profile not found after session load.")
          
          if (userData) {
            setState((prev) => ({
              ...prev,
              user: {
                id: userData.id,
                name: userData.full_name,
                email: userData.email,
                phone: userData.phone || "",
                city: userData.city || "Қызылорда",
                address: userData.address || "",
                role: userData.role || "customer",
              },
              isAuthenticated: true,
            }))
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        // If there's an error (e.g. JWT expired), ensure user is logged out
        setState(prev => ({ ...prev, user: null, isAuthenticated: false }))
      } finally {
        setState((prev) => ({...prev, isAuthLoading: false}))
      }
    }

    initializeAuth()
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (state.theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [state.theme])

  // Save to localStorage on state change
  useEffect(() => {
    if (!state.isAuthLoading) {
      try {
        localStorage.setItem(
          "foodDeliveryState",
          JSON.stringify({
            cart: state.cart,
            favorites: Array.from(state.favorites),
            location: state.location,
            theme: state.theme,
            language: state.language,
          }),
        )
      } catch (error) {
          console.error("Error saving state to localStorage:", error)
      }
    }
  }, [state.cart, state.favorites, state.location, state.theme, state.language, state.isAuthLoading])

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const result = await authenticate(email, password);

      if (result.success) {
        const { user: authUser } = result;
        const loggedInUser: User = {
          id: authUser.id,
          name: authUser.fullName || "",
          email: authUser.email,
          role: authUser.role,
          phone: "", // These can be fetched separately if needed upon profile view
          city: state.location,
          address: "",
        };

        setState((prev) => ({
          ...prev,
          user: loggedInUser,
          isAuthenticated: true,
        }));
        
        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Login provider error:", error);
      if (error instanceof Error) throw error;
      throw new Error("Login failed due to an unexpected error.");
    }
  }

  const logout = async () => {
    try {
      const supabaseClient = getSupabase()
      await supabaseClient.auth.signOut()
    } catch (error) {
      console.error("Logout error:", error)
    }

    setState((prev) => ({
      ...prev,
      user: null,
      isAuthenticated: false,
    }))
  }

  const updateUser = async (userData: Partial<User>) => {
    if (!state.user || !state.isAuthenticated) return false

    const supabaseClient = getSupabase()
    const payload: {
      full_name?: string
      phone?: string
      city?: string
      address?: string
    } = {}

    if (typeof userData.name === "string") payload.full_name = userData.name
    if (typeof userData.phone === "string") payload.phone = userData.phone
    if (typeof userData.city === "string") payload.city = userData.city
    if (typeof userData.address === "string") payload.address = userData.address

    if (Object.keys(payload).length === 0) return true

    const { error } = await supabaseClient.from("users").update(payload).eq("id", state.user.id)
    if (error) {
      console.error("Profile save error:", error.message)
      throw new Error("Failed to update profile")
    }

    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : prev.user,
      location: typeof userData.city === "string" ? userData.city : prev.location,
    }))

    return true
  }
  
  // --- Cart, Favorites, and other methods remain the same ---
  const addToCart = (item: FoodItem) => setState(prev => ({ ...prev, cart: [...prev.cart, { ...item, quantity: 1 }] }));
  const removeFromCart = (itemId: string) => setState(prev => ({ ...prev, cart: prev.cart.filter(i => i.id !== itemId) }));
  const updateQuantity = (itemId: string, quantity: number) => setState(prev => ({ ...prev, cart: quantity <= 0 ? prev.cart.filter(i => i.id !== itemId) : prev.cart.map(i => i.id === itemId ? { ...i, quantity } : i) }));
  const clearCart = () => setState(prev => ({ ...prev, cart: [] }));
  const toggleFavorite = (itemId: string) => {
    setState(prev => {
      const newFavorites = new Set(prev.favorites);
      if (newFavorites.has(itemId)) newFavorites.delete(itemId);
      else newFavorites.add(itemId);
      return { ...prev, favorites: newFavorites };
    });
  };
  const setLocation = (location: string) => setState(prev => ({ ...prev, location }));
  const setSearchQuery = (query: string) => setState(prev => ({ ...prev, searchQuery: query }));
  const getCartTotal = () => state.cart.reduce((total, item) => total + (item.discount ? item.price * (1 - item.discount / 100) : item.price) * item.quantity, 0);
  const getCartCount = () => state.cart.reduce((count, item) => count + item.quantity, 0);
  const toggleTheme = () => setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  const setLanguage = (lang: Language) => setState(prev => ({ ...prev, language: lang }));
  const getBookings = (): Booking[] => state.bookings;
  const removeBooking = async (bookingId: string): Promise<void> => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.filter((b) => b.id !== bookingId),
    }));
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavorite,
        setLocation,
        setSearchQuery,
        getCartTotal,
        getCartCount,
        toggleTheme,
        setLanguage,
        getBookings,
        removeBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}

export const useAppStore = useApp
