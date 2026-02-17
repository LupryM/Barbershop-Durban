import Database from 'better-sqlite3';
import { join } from 'path';

let db: Database.Database | null = null;

// Only initialize database in development
if (process.env.NODE_ENV === 'development') {
  const dbPath = join(process.cwd(), 'xclusive-barber.db');
  db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
}

// Initialize database schema
export function initDb() {
  if (!db) return;
  
  // Users table (customers and staff)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE NOT NULL,
      name TEXT,
      email TEXT,
      role TEXT DEFAULT 'customer' CHECK(role IN ('customer', 'barber', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Barbers table (extended profile for barbers)
  db.exec(`
    CREATE TABLE IF NOT EXISTS barbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      specialty TEXT,
      experience TEXT,
      image_url TEXT,
      is_active BOOLEAN DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Customers table (extended profile for customers)
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      preferences TEXT,
      notes TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Appointments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      barber_id INTEGER NOT NULL,
      service_name TEXT NOT NULL,
      service_price TEXT NOT NULL,
      service_duration TEXT NOT NULL,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (barber_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Barber availability table
  db.exec(`
    CREATE TABLE IF NOT EXISTS barber_availability (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barber_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      type TEXT DEFAULT 'unavailable' CHECK(type IN ('unavailable', 'lunch', 'time_off')),
      reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (barber_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // OTP table for authentication
  db.exec(`
    CREATE TABLE IF NOT EXISTS otp_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      used BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Seed initial barbers
  const barberCount = db.prepare('SELECT COUNT(*) as count FROM barbers').get() as { count: number };
  
  if (barberCount.count === 0) {
    // Create barber users
    const insertUser = db.prepare('INSERT INTO users (phone, name, role) VALUES (?, ?, ?)');
    const insertBarber = db.prepare('INSERT INTO barbers (user_id, specialty, experience, image_url) VALUES (?, ?, ?, ?)');
    
    const barbers = [
      { phone: '+27821111111', name: 'Thabo Mkhize', specialty: 'Master Barber', experience: '10+ years' },
      { phone: '+27822222222', name: 'Sipho Nkosi', specialty: 'Fade Specialist', experience: '7+ years' },
      { phone: '+27823333333', name: 'Mandla Dlamini', specialty: 'Beard Expert', experience: '8+ years' }
    ];

    barbers.forEach(barber => {
      const result = insertUser.run(barber.phone, barber.name, 'barber');
      insertBarber.run(result.lastInsertRowid, barber.specialty, barber.experience, '/placeholder.svg?height=300&width=300');
    });

    // Create admin user
    insertUser.run('+27829999999', 'Shop Owner', 'admin');
  }
}

// Initialize database on import
initDb();

export default db;
