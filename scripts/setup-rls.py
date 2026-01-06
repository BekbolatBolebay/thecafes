#!/usr/bin/env python3
"""
Суpabase RLS ынамдықтарын ақтау скрипті
"""

import requests
import json

# Конфигурация
SUPABASE_URL = "https://sotdiawltdwmpvmtrwlm.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvdGRpYXdsdGR3bXB2bXRyd2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNzY3NTgsImV4cCI6MjA4MDg1Mjc1OH0.wzGf0cH8TMW-8JyFAVqluoqsnWJnnZEsF6fIGRAjVWU"

# SQL queries to execute
sql_queries = [
    # Enable RLS on users table
    "ALTER TABLE users ENABLE ROW LEVEL SECURITY;",
    
    # Drop existing policies if they exist
    "DROP POLICY IF EXISTS \"Allow new user registration\" ON users;",
    "DROP POLICY IF EXISTS \"Users can view their own data\" ON users;",
    "DROP POLICY IF EXISTS \"Users can update their own data\" ON users;",
    "DROP POLICY IF EXISTS \"Admins can view all users\" ON users;",
    "DROP POLICY IF EXISTS \"Admins can update users\" ON users;",
    
    # Create new policies
    """CREATE POLICY \"Allow new user registration\" ON users 
    FOR INSERT 
    WITH CHECK (true);""",
    
    """CREATE POLICY \"Users can view their own data\" ON users 
    FOR SELECT 
    USING (auth.uid() = id);""",
    
    """CREATE POLICY \"Users can update their own data\" ON users 
    FOR UPDATE 
    USING (auth.uid() = id);""",
    
    """CREATE POLICY \"Admins can view all users\" ON users 
    FOR SELECT 
    USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
    );""",
    
    """CREATE POLICY \"Admins can update users\" ON users 
    FOR UPDATE 
    USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
    );""",
    
    # Make password_hash nullable
    "ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;",
]

def execute_sql(query):
    """Execute SQL query via Supabase API"""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }
    
    data = {
        "query": query
    }
    
    try:
        # Note: This won't work with the standard Supabase client endpoint
        # We need to use the SQL endpoint if available
        print(f"Executing: {query[:50]}...")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("⚠️  MANUAL STEPS REQUIRED:")
    print("\n1. Go to Supabase Dashboard: https://supabase.com/dashboard")
    print("2. Select your project: sotdiawltdwmpvmtrwlm")
    print("3. Go to SQL Editor")
    print("4. Run the following SQL queries:\n")
    
    for i, query in enumerate(sql_queries, 1):
        print(f"--- Query {i} ---")
        print(query)
        print()
    
    print("\nAfter executing these queries, refresh your app and try registering again.")
