CREATE TABLE IF NOT EXISTS t_p82742348_boat_ticket_booking.admin_settings (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
