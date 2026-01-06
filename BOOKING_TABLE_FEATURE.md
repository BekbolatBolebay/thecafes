# Restaurant Table Booking Feature

## Overview
A complete interactive table booking system has been added to the restaurant detail page, allowing customers to visualize available tables and reserve them with date, time, and guest count.

## Files Created

### 1. `/components/booking-table-map.tsx`
A new React component that displays an interactive restaurant floor map with:

**Features:**
- **Table Grid Layout**: Visual representation of restaurant tables organized in different zones
- **Zone System**: Tables are grouped by areas:
  - 🎵 Сахна (Music Zone)
  - 👑 VIP zona (VIP Zone)
  - 🪟 Терезе жақ (Window Area)
  - 🍷 Бар зонасы (Bar Area)
  - 🌿 Ғұлсыз зона (Garden Area)

- **Interactive Features**:
  - Click tables to select them
  - Hover for detailed table information
  - Color-coded table status (available = purple, booked = gray, selected = accent color)
  - Zoom controls to adjust map view (50% - 150%)
  - Real-time availability counter
  - Zone legend showing all areas

- **Table Information Display**:
  - Table number
  - Seating capacity
  - Zone location
  - Availability status (Бос/Қойылды)

**Default Tables Configuration** (9 tables):
```
Zone: Сахна (Music)
- Table 1: 4 seats (available)
- Table 2: 4 seats (unavailable)

Zone: VIP zona
- Table 3: 6 seats (available)

Zone: Терезе жақ (Window)
- Table 4: 2 seats (available)
- Table 5: 2 seats (available)
- Table 6: 2 seats (unavailable)

Zone: Бар зонасы (Bar)
- Table 7: 5 seats (available)

Zone: Ғұлсыз зона (Garden)
- Table 8: 4 seats (available)
- Table 9: 4 seats (available)
```

## Files Modified

### 1. `/app/restaurant/[id]/page.tsx`
Updated the restaurant detail page to:

**Changes:**
- Imported `BookingTableMap` component
- Added new state variables:
  - `selectedTableId`: Tracks currently selected table
  - `selectedTableName`: Stores the name of selected table
  - Enhanced `bookingData` to include `tableId` and `tableName`

- Added new handler functions:
  - `handleTableSelect()`: Called when user selects a table
  - `handleTableReserve()`: Called when user clicks reserve button on the map
  - Updated `confirmBooking()`: Clears table selection after confirmation

- Enhanced Booking Modal:
  - Moved from single form to a larger modal with 2 sections:
    1. **Table Selection Map** (top) - Interactive floor map
    2. **Booking Details Form** (bottom) - Date, time, guests, notes
  - Added visual confirmation of selected table
  - Made confirm button disabled until table + date + time are selected
  - Improved modal styling with proper scrolling for mobile

### 2. `/lib/translations.ts`
Added new translation keys in all three languages (Kazakh, Russian, English):

**New Keys:**
- `bookTable`: "Book/Reserve Table"
- `selectDate`: "Select Date"
- `selectTime`: "Select Time"
- `numberOfGuests`: "Number of Guests"
- `specialRequests`: "Special Requests/Comments"
- `confirmBooking`: "Confirm Booking"
- `bookingSuccess`: "Booking successful"
- `reserveTable`: "Reserve Table"

**Supported Languages:**
- 🇰🇿 Kazakh (kk)
- 🇷🇺 Russian (ru)
- 🇬🇧 English (en)

## Component Props

```typescript
interface BookingTableMapProps {
  restaurantName?: string          // Restaurant name to display
  onTableSelect?: (tableId: string, tableName: string) => void  // Callback when table is selected
  selectedTable?: string | null    // Currently selected table ID
  onReserve?: (tableId: string) => void  // Callback when reserve button is clicked
}
```

## Usage Example

```tsx
<BookingTableMap
  restaurantName={restaurant.name}
  onTableSelect={handleTableSelect}
  selectedTable={selectedTableId}
  onReserve={handleTableReserve}
/>
```

## Styling & Responsive Design

- **Fully Responsive**: Works on mobile (small zoom), tablet, and desktop screens
- **Dark Mode Support**: Complete dark mode styling with Tailwind CSS
- **Theme Integration**: Uses the app's existing color variables (accent, background, muted, etc.)
- **Smooth Animations**: Hover effects and transitions for better UX
- **Accessibility**: Proper semantic HTML and interactive element labeling

## How to Use (End User)

1. **Open a Restaurant**: Click on any restaurant from the home page
2. **Click "Брондау"/"Book Table" Button**: Opens the booking modal
3. **Select a Table**: Click on any available (purple) table on the floor map
4. **View Table Details**: Hover over a table to see capacity and zone
5. **Fill Booking Details**:
   - Select date using date picker
   - Select time using time picker
   - Select number of guests from dropdown
   - Add any special requests (optional)
6. **Confirm Booking**: Click "Растау"/"Confirm" button (only enabled when table + date + time are selected)
7. **Success**: See confirmation message

## Future Enhancements

Potential improvements for production:

1. **Backend Integration**:
   - Save bookings to Supabase database
   - Real-time table availability updates
   - Multi-restaurant table configurations

2. **Admin Features**:
   - Custom restaurant floor plan designer
   - Dynamic table capacity management
   - Time slot management

3. **Customer Features**:
   - Booking history and management
   - Cancellation and modification options
   - Email/SMS confirmations
   - Waiting list for popular times

4. **Analytics**:
   - Track booking patterns
   - Peak time analysis
   - Occupancy rates

## Technical Stack

- **Framework**: Next.js 16 with React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState)
- **Internationalization**: Custom translation system

## Notes

- Tables are currently static and defined in the component
- Table availability is hardcoded (Table 2 and 6 are marked as unavailable by default)
- The feature is UI-complete; backend integration with Supabase is the next step
- The zoom controls allow users to focus on specific areas of large maps
- The component is fully self-contained and can be reused in other parts of the app
