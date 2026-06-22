
CREATE TABLE IF NOT EXISTS t_p82742348_boat_ticket_booking.users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(100),
  name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p82742348_boat_ticket_booking.bookings (
  id SERIAL PRIMARY KEY,
  ticket_code VARCHAR(30) NOT NULL UNIQUE,
  user_id INTEGER REFERENCES t_p82742348_boat_ticket_booking.users(id),
  format VARCHAR(100) NOT NULL,
  trip_date DATE NOT NULL,
  passenger_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
