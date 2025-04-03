# Hotel Management System - Technical Documentation

## Database Schema

### Users Table
```sql
users (
  id uuid primary key
  email text unique
  role text -- 'admin', 'receptionist', 'guest'
  created_at timestamp
  last_sign_in timestamp
)
```

### Rooms Table
```sql
rooms (
  id uuid primary key
  room_number text unique
  type text -- 'standard', 'deluxe', 'suite'
  status text -- 'available', 'booked', 'occupied', 'maintenance'
  price decimal
  floor integer
  capacity integer
  amenities jsonb
)
```

### Bookings Table
```sql
bookings (
  id uuid primary key
  room_id uuid references rooms(id)
  guest_id uuid references users(id)
  check_in timestamp
  check_out timestamp
  status text -- 'confirmed', 'checked_in', 'checked_out', 'cancelled'
  total_amount decimal
  payment_status text
  created_at timestamp
)
```

### Guests Table
```sql
guests (
  id uuid primary key
  user_id uuid references users(id)
  first_name text
  last_name text
  phone text
  address text
  document_type text
  document_number text
  preferences jsonb
)
```

### Conference Rooms Table
```sql
conference_rooms (
  id uuid primary key
  name text
  capacity integer
  price_per_hour decimal
  amenities jsonb
  status text -- 'available', 'booked'
)
```

### Restaurant Tables
```sql
restaurant_tables (
  id uuid primary key
  table_number integer
  capacity integer
  status text -- 'available', 'occupied', 'reserved'
)
```

## API Endpoints

### Authentication
- POST /auth/login
- POST /auth/register
- POST /auth/logout
- GET /auth/user

### Rooms
- GET /rooms
- GET /rooms/:id
- POST /rooms
- PUT /rooms/:id
- GET /rooms/availability

### Bookings
- GET /bookings
- POST /bookings
- PUT /bookings/:id
- GET /bookings/:id
- DELETE /bookings/:id

### Guests
- GET /guests
- POST /guests
- PUT /guests/:id
- GET /guests/:id

### Conference
- GET /conference-rooms
- POST /conference-bookings
- GET /conference-availability

### Restaurant
- GET /tables
- POST /reservations
- GET /menu
- POST /orders

## Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── rooms/
│   │   ├── RoomList.tsx
│   │   ├── RoomCard.tsx
│   │   └── RoomForm.tsx
│   ├── bookings/
│   │   ├── BookingList.tsx
│   │   ├── BookingForm.tsx
│   │   └── BookingDetails.tsx
│   └── shared/
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
```

## State Management

### Supabase Realtime Subscriptions
```typescript
// Example of room status subscription
const roomSubscription = supabase
  .from('rooms')
  .on('UPDATE', (payload) => {
    // Handle room status changes
  })
  .subscribe()
```

### Context Structure
```typescript
// Auth Context
interface AuthContext {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Booking Context
interface BookingContext {
  bookings: Booking[];
  loading: boolean;
  error: Error | null;
  createBooking: (data: BookingData) => Promise<void>;
  updateBooking: (id: string, data: Partial<BookingData>) => Promise<void>;
}
```

## Development Setup

1. Environment Setup
```bash
# Required environment variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Database Setup
```sql
-- Run initial migrations
-- Create required tables
-- Set up row level security policies
```

3. Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Security Implementation

### Row Level Security (RLS) Policies
```sql
-- Example RLS for bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (
    auth.role() = 'admin'
  );

-- Users can only view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (
    auth.uid() = guest_id
  );
```

### Authentication Flow
1. User submits login credentials
2. Supabase validates credentials
3. JWT token generated and stored
4. Client includes token in subsequent requests
5. Server validates token and role permissions

## Testing Strategy

### Unit Tests
- Component rendering
- Form validation
- State management
- Utility functions

### Integration Tests
- API endpoints
- Database operations
- Authentication flow
- Booking process

### E2E Tests
- User journeys
- Critical paths
- Cross-browser compatibility

## Performance Optimization

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

### Backend
- Query optimization
- Connection pooling
- Rate limiting
- Response caching

## Deployment

### Production Checklist
- Environment variables
- SSL certificates
- Database backups
- Monitoring setup
- Error tracking
- Performance metrics

### CI/CD Pipeline
- Build verification
- Automated testing
- Staging deployment
- Production deployment
- Rollback procedures 