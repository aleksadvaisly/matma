#!/usr/bin/env python3
import sqlite3

def format_order_index(exercise_id):
    """Convert ID like '7-1-2-a' to '07-01-02-a'"""
    parts = exercise_id.split('-')
    
    # Format numeric parts with zero padding
    formatted_parts = []
    for part in parts:
        if part.isdigit():
            formatted_parts.append(f"{int(part):02d}")
        else:
            formatted_parts.append(part)
    
    return '-'.join(formatted_parts)

def update_order_indexes():
    conn = sqlite3.connect('matma.db')
    cursor = conn.cursor()
    
    # Get all exercises
    cursor.execute("SELECT id FROM exercises")
    exercises = cursor.fetchall()
    
    # Update each exercise
    for (exercise_id,) in exercises:
        new_order_index = format_order_index(exercise_id)
        cursor.execute("UPDATE exercises SET order_index = ? WHERE id = ?", 
                      (new_order_index, exercise_id))
    
    # Do the same for sections
    cursor.execute("SELECT id FROM sections")
    sections = cursor.fetchall()
    
    for (section_id,) in sections:
        new_order_index = format_order_index(section_id)
        cursor.execute("UPDATE sections SET order_index = ? WHERE id = ?", 
                      (new_order_index, section_id))
    
    conn.commit()
    print(f"Updated {len(exercises)} exercises and {len(sections)} sections")
    
    # Show sample results
    cursor.execute("SELECT id, order_index FROM exercises WHERE section_id = '7-1' LIMIT 5")
    print("\nSample exercises:")
    for row in cursor.fetchall():
        print(f"  {row[0]} -> {row[1]}")
    
    cursor.execute("SELECT id, order_index FROM sections WHERE chapter_id = 'chapter-1' LIMIT 3")
    print("\nSample sections:")
    for row in cursor.fetchall():
        print(f"  {row[0]} -> {row[1]}")
    
    conn.close()

if __name__ == "__main__":
    update_order_indexes()