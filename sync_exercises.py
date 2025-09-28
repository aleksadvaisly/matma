#!/usr/bin/env python3
"""Synchronize exercises in matma.db with docs/work/zadania_wszystko.md variants."""

import argparse
import re
import sqlite3
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional

DOC_PATH = Path('docs/work/zadania_wszystko.md')
DB_PATH = Path('matma.db')


@dataclass
class Variant:
  letter: str
  prompt: str
  answer: str


@dataclass
class ExerciseEntry:
  base_id: str
  title_question: str
  question: str
  story: str
  answer: str
  options: List[str]
  hint: str
  explanation: str
  difficulty_level: Optional[int]
  type_label: str
  variants: List[Variant]


FIELD_PATTERN = re.compile(r"- \*\*(.+?):\*\* *(.+)")
BASE_PATTERN = re.compile(r"\s*\d+\. \*\*(\d+-\d+-\d+)\*\*: *(.+)?")
VARIANT_PATTERN = re.compile(r"([a-z])\)\s*(.*)")
DIGIT_PATTERN = re.compile(r"(\d+)")
NON_ALPHANUM_RE = re.compile(r",| oraz | i | oraz | i\s+|;|")


def parse_doc(path: Path) -> Dict[str, ExerciseEntry]:
  entries: Dict[str, ExerciseEntry] = {}
  current_id: Optional[str] = None
  collecting_variants = False

  for raw_line in path.read_text().splitlines():
    base_match = BASE_PATTERN.match(raw_line)
    if base_match:
      current_id = base_match.group(1)
      rest = base_match.group(2) or ''
      entries[current_id] = ExerciseEntry(
        base_id=current_id,
        title_question=rest.strip(),
        question='',
        story='',
        answer='',
        options=[],
        hint='',
        explanation='',
        difficulty_level=None,
        type_label='',
        variants=[]
      )
      collecting_variants = False
      continue

    if current_id is None:
      continue

    stripped = raw_line.strip()
    field_match = FIELD_PATTERN.match(stripped)
    if field_match:
      field, value = field_match.groups()
      value = value.strip()
      entry = entries[current_id]
      if field == 'Pytanie':
        entry.question = value
      elif field == 'Treść':
        entry.story = value
      elif field == 'Odpowiedź':
        entry.answer = value
      elif field == 'Opcje':
        entry.options = [opt.strip() for opt in value.split(',') if opt.strip()]
      elif field == 'Wskazówka':
        entry.hint = value
      elif field == 'Wyjaśnienie':
        entry.explanation = value
      elif field == 'Difficulty_level':
        digit_match = DIGIT_PATTERN.search(value)
        if digit_match:
          entry.difficulty_level = int(digit_match.group(1))
      elif field == 'Typ':
        entry.type_label = value
      collecting_variants = field == 'Warianty'
      continue

    if stripped.startswith('- **Warianty:**'):
      collecting_variants = True
      continue

    if collecting_variants:
      if stripped.startswith('- '):
        variant_line = stripped[2:].strip()
        variant_match = VARIANT_PATTERN.match(variant_line)
        if variant_match:
          letter, rest = variant_match.groups()
          prompt = rest
          answer = ''
          if '→' in rest:
            prompt, answer = [piece.strip() for piece in rest.split('→', 1)]
          elif '->' in rest:
            prompt, answer = [piece.strip() for piece in rest.split('->', 1)]
          entries[current_id].variants.append(Variant(letter=letter, prompt=prompt, answer=answer))
      else:
        collecting_variants = False

  return entries


def build_full_id(row: sqlite3.Row, letter: str) -> str:
  return f"{row['division_roman']}.{row['chapter_number']}.{row['section_number']}.{row['exercise_number']}.{letter}"


def build_question(template: str, prompt_a: str, prompt_variant: str, has_story: bool) -> str:
  template = (template or '').strip()
  prompt_variant = prompt_variant.strip()
  prompt_a = prompt_a.strip()

  if template:
    if prompt_a and prompt_a in template:
      return template.replace(prompt_a, prompt_variant)
    if prompt_a and prompt_a.lower() in template.lower():
      lowered = template.lower().replace(prompt_a.lower(), prompt_variant)
      return lowered
    if prompt_variant:
      if has_story:
        return template
      if template.endswith('?'):
        base = template[:-1].rstrip()
        return f"{base} ({prompt_variant})?"
      if template.endswith('.'):
        base = template[:-1].rstrip()
        return f"{base}: {prompt_variant}"
      if template.endswith(':'):
        return f"{template} {prompt_variant}"
      return f"{template} {prompt_variant}".strip()
    return template

  return prompt_variant or template


def split_tokens(value: str) -> List[str]:
  if not value:
    return []
  if ', ' in value:
    return [piece.strip() for piece in value.split(',') if piece.strip()]
  return [value.strip()]


def build_story(template: str, prompt_a: str, prompt_variant: str) -> str:
  template = (template or '').strip()
  if not template:
    return ''

  prompt_a = prompt_a.strip()
  prompt_variant = prompt_variant.strip()

  if prompt_a and prompt_a in template:
    return template.replace(prompt_a, prompt_variant)

  tokens_a = split_tokens(prompt_a)
  tokens_variant = split_tokens(prompt_variant)
  if tokens_a and len(tokens_a) == len(tokens_variant):
    result = template
    for source, target in zip(tokens_a, tokens_variant):
      if source:
        result = result.replace(source, target, 1)
    return result

  return template


def ensure_non_empty(value: str, label: str) -> str:
  if value.strip():
    return value.strip()
  raise ValueError(f"Missing required value for {label}")


def sync_entries(entries: Dict[str, ExerciseEntry], conn: sqlite3.Connection, filters: List[str], dry_run: bool) -> Dict[str, Dict[str, List[str]]]:
  summary: Dict[str, Dict[str, List[str]]] = {}
  conn.row_factory = sqlite3.Row
  cur = conn.cursor()

  for base_id, entry in sorted(entries.items()):
    if filters and not any(base_id.startswith(prefix) for prefix in filters):
      continue

    base_row = cur.execute("SELECT * FROM exercises WHERE id = ?", (base_id,)).fetchone()
    if base_row is None:
      print(f"[WARN] Base exercise {base_id} missing in database, skipping.")
      continue

    if not entry.variants:
      continue

    prompt_a = entry.variants[0].prompt
    question_template = entry.question or entry.title_question or (base_row['question'] or '')
    story_template = entry.story or (base_row['story'] or '')
    difficulty = entry.difficulty_level or base_row['difficulty_level'] or 1
    hint = entry.hint or base_row['hint'] or None
    explanation = entry.explanation or base_row['explanation'] or None
    options = entry.options

    summary.setdefault(base_id, {'inserted': [], 'updated': []})

    for variant in entry.variants:
      variant_id = f"{base_id}-{variant.letter}"
      question_text = build_question(question_template, prompt_a, variant.prompt, bool(story_template))
      story_text = build_story(story_template, prompt_a, variant.prompt)
      correct_answer = variant.answer or entry.answer
      correct_answer = ensure_non_empty(correct_answer, f"correct_answer for {variant_id}")
      full_id = build_full_id(base_row, variant.letter)

      existing = cur.execute("SELECT id FROM exercises WHERE id = ?", (variant_id,)).fetchone()

      if dry_run:
        action = 'would update' if existing else 'would insert'
        print(f"[DRY] {action} {variant_id}")
      else:
        if existing:
          cur.execute(
            """
            UPDATE exercises
               SET question = ?,
                   story = ?,
                   correct_answer = ?,
                   hint = ?,
                   explanation = ?,
                   difficulty_level = ?,
                   input_type_id = ?,
                   section_id = ?,
                   division_roman = ?,
                   chapter_number = ?,
                   section_number = ?,
                   exercise_number = ?,
                   full_id = ?,
                   variant_letter = ?,
                   exercise_base_id = ?,
                   updated_at = CURRENT_TIMESTAMP
             WHERE id = ?
            """,
            (
              question_text,
              story_text,
              correct_answer,
              hint,
              explanation,
              difficulty,
              base_row['input_type_id'],
              base_row['section_id'],
              base_row['division_roman'],
              base_row['chapter_number'],
              base_row['section_number'],
              base_row['exercise_number'],
              full_id,
              variant.letter,
              base_id,
              variant_id
            )
          )
          summary[base_id]['updated'].append(variant_id)
        else:
          cur.execute(
            """
            INSERT INTO exercises (
              id,
              section_id,
              division_roman,
              chapter_number,
              section_number,
              exercise_number,
              full_id,
              input_type_id,
              question,
              story,
              correct_answer,
              hint,
              explanation,
              difficulty_level,
              variant_letter,
              exercise_base_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
              variant_id,
              base_row['section_id'],
              base_row['division_roman'],
              base_row['chapter_number'],
              base_row['section_number'],
              base_row['exercise_number'],
              full_id,
              base_row['input_type_id'],
              question_text,
              story_text,
              correct_answer,
              hint,
              explanation,
              difficulty,
              variant.letter,
              base_id
            )
          )
          summary[base_id]['inserted'].append(variant_id)

        cur.execute("DELETE FROM exercise_options WHERE exercise_id = ?", (variant_id,))
        for idx, option in enumerate(options, start=1):
          cur.execute(
            "INSERT INTO exercise_options (exercise_id, option_text) VALUES (?, ?)",
            (variant_id, option)
          )

    if not dry_run:
      cur.execute(
        "UPDATE exercises SET difficulty_level = ?, hint = ?, explanation = ?, question = ?, story = ?, correct_answer = ? WHERE id = ?",
        (
          difficulty,
          hint,
          explanation,
          question_template,
          story_template,
          entry.answer or base_row['correct_answer'],
          base_id
        )
      )

  if not dry_run:
    conn.commit()

  return summary


def main() -> None:
  parser = argparse.ArgumentParser(description='Synchronize exercises from Markdown document into matma.db')
  parser.add_argument('--dry-run', action='store_true', help='Print planned changes without modifying the database')
  parser.add_argument('--filter', nargs='*', default=[], help='Prefix filters for base exercise ids (e.g. 1-2)')
  args = parser.parse_args()

  entries = parse_doc(DOC_PATH)
  with sqlite3.connect(DB_PATH) as conn:
    summary = sync_entries(entries, conn, args.filter, args.dry_run)

  total_inserted = sum(len(data['inserted']) for data in summary.values())
  total_updated = sum(len(data['updated']) for data in summary.values())
  print(f"Inserted {total_inserted} variants, updated {total_updated} variants.")


if __name__ == '__main__':
  main()
