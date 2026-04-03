/**
 * IQ Tester — Question Bank
 * 30 questions across 6 categories (5 each)
 */

const CATEGORIES = {
  PATTERN: { name: 'Pattern Recognition', icon: '🔷', color: '#6366f1' },
  LOGIC: { name: 'Logical Reasoning', icon: '🧠', color: '#8b5cf6' },
  SPATIAL: { name: 'Spatial Awareness', icon: '📐', color: '#a78bfa' },
  NUMERICAL: { name: 'Numerical Ability', icon: '🔢', color: '#c4b5fd' },
  VERBAL: { name: 'Verbal Intelligence', icon: '📝', color: '#818cf8' },
  MEMORY: { name: 'Memory & Attention', icon: '👁️', color: '#7c3aed' }
};

const QUESTIONS = [
  // ── Pattern Recognition (5) ──────────────────
  {
    id: 1,
    category: 'PATTERN',
    question: 'What comes next in the sequence: 2, 6, 18, 54, __?',
    options: ['108', '162', '148', '216'],
    correctIndex: 1,
    explanation: 'Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162.'
  },
  {
    id: 2,
    category: 'PATTERN',
    question: 'Complete the pattern: A1, B2, C3, D4, __?',
    options: ['E5', 'F6', 'D5', 'E4'],
    correctIndex: 0,
    explanation: 'Letters increase by 1 (A→B→C→D→E), numbers increase by 1 (1→2→3→4→5).'
  },
  {
    id: 3,
    category: 'PATTERN',
    question: 'What number comes next: 1, 1, 2, 3, 5, 8, __?',
    options: ['11', '12', '13', '15'],
    correctIndex: 2,
    explanation: 'Fibonacci sequence: each number is the sum of the two preceding numbers (5+8=13).'
  },
  {
    id: 4,
    category: 'PATTERN',
    question: 'Find the next term: 3, 6, 11, 18, 27, __?',
    options: ['36', '38', '34', '40'],
    correctIndex: 1,
    explanation: 'Differences increase by 2: +3, +5, +7, +9, +11 → 27+11=38.'
  },
  {
    id: 5,
    category: 'PATTERN',
    question: 'What comes next: Z, X, V, T, __?',
    options: ['S', 'R', 'Q', 'P'],
    correctIndex: 1,
    explanation: 'Skipping one letter backwards each time: Z, (Y), X, (W), V, (U), T, (S), R.'
  },

  // ── Logical Reasoning (5) ──────────────────
  {
    id: 6,
    category: 'LOGIC',
    question: 'All roses are flowers. Some flowers fade quickly. Which conclusion is valid?',
    options: [
      'All roses fade quickly',
      'Some roses may fade quickly',
      'No roses fade quickly',
      'Flowers are always roses'
    ],
    correctIndex: 1,
    explanation: 'Since roses are a subset of flowers, and some flowers fade quickly, it is possible (but not certain) that some roses fade quickly.'
  },
  {
    id: 7,
    category: 'LOGIC',
    question: 'If it rains, the ground is wet. The ground is not wet. What can you conclude?',
    options: [
      'It is raining',
      'It might be raining',
      'It is not raining',
      'Nothing can be concluded'
    ],
    correctIndex: 2,
    explanation: 'This is modus tollens: if P→Q, and ¬Q, then ¬P. Since the ground is not wet, it is not raining.'
  },
  {
    id: 8,
    category: 'LOGIC',
    question: 'Tom is taller than Jerry. Jerry is taller than Spike. Who is the shortest?',
    options: ['Tom', 'Jerry', 'Spike', 'Cannot be determined'],
    correctIndex: 2,
    explanation: 'Tom > Jerry > Spike, therefore Spike is the shortest.'
  },
  {
    id: 9,
    category: 'LOGIC',
    question: 'A clock loses 5 minutes every hour. If set correctly at noon, what time will it show at 4 PM actual time?',
    options: ['3:40 PM', '3:20 PM', '3:30 PM', '3:50 PM'],
    correctIndex: 1,
    explanation: 'In 4 hours, the clock loses 4×5=20 minutes. So it shows 4:00 PM − 20 min = 3:40 PM. Wait: it shows 55 min per hour × 4 hours = 220 min = 3h 40m. Noon + 3:40 = 3:40 PM.'
  },
  {
    id: 10,
    category: 'LOGIC',
    question: 'If no heroes are cowards and some soldiers are cowards, what must be true?',
    options: [
      'No soldiers are heroes',
      'Some soldiers are not heroes',
      'All soldiers are heroes',
      'All heroes are soldiers'
    ],
    correctIndex: 1,
    explanation: 'Some soldiers are cowards, and no heroes are cowards, so those soldiers who are cowards cannot be heroes. Thus, some soldiers are not heroes.'
  },

  // ── Spatial Awareness (5) ──────────────────
  {
    id: 11,
    category: 'SPATIAL',
    question: 'If you fold a square piece of paper in half diagonally and cut off the folded corner, what shape do you get when unfolded?',
    options: ['Triangle', 'Diamond / Rhombus', 'Pentagon', 'Hexagon'],
    correctIndex: 1,
    explanation: 'Cutting the corner of a diagonally folded square creates a diamond (rhombus) shape when unfolded.'
  },
  {
    id: 12,
    category: 'SPATIAL',
    question: 'A cube has 6 faces, 12 edges, and how many vertices?',
    options: ['6', '8', '10', '12'],
    correctIndex: 1,
    explanation: 'A cube has 8 vertices (corners). This follows Euler\'s formula: V - E + F = 2 → 8 - 12 + 6 = 2.'
  },
  {
    id: 13,
    category: 'SPATIAL',
    question: 'If you look at a clock in a mirror and it shows 2:30, what is the actual time?',
    options: ['9:30', '10:30', '8:30', '3:30'],
    correctIndex: 0,
    explanation: 'In a mirror, time is reflected. Subtract the mirror time from 12:00: 12:00 − 2:30 = 9:30.'
  },
  {
    id: 14,
    category: 'SPATIAL',
    question: 'How many triangles can be found in a 5-pointed star (pentagram)?',
    options: ['5', '10', '15', '20'],
    correctIndex: 1,
    explanation: 'A pentagram contains 10 triangles: 5 small triangles at the points and 5 larger triangles formed by the inner intersections.'
  },
  {
    id: 15,
    category: 'SPATIAL',
    question: 'If you rotate the letter "N" 90° clockwise, what does it look like?',
    options: ['Z', 'И', 'N sideways (like Z)', 'U'],
    correctIndex: 2,
    explanation: 'Rotating "N" 90° clockwise makes it look similar to a "Z" turned on its side.'
  },

  // ── Numerical Ability (5) ──────────────────
  {
    id: 16,
    category: 'NUMERICAL',
    question: 'If 5 machines can produce 5 widgets in 5 minutes, how long would it take 100 machines to produce 100 widgets?',
    options: ['100 minutes', '5 minutes', '20 minutes', '1 minute'],
    correctIndex: 1,
    explanation: 'Each machine produces 1 widget in 5 minutes. 100 machines working simultaneously produce 100 widgets in 5 minutes.'
  },
  {
    id: 17,
    category: 'NUMERICAL',
    question: 'What is 15% of 240?',
    options: ['32', '34', '36', '38'],
    correctIndex: 2,
    explanation: '15% of 240 = 0.15 × 240 = 36.'
  },
  {
    id: 18,
    category: 'NUMERICAL',
    question: 'A shirt costs $60 after a 25% discount. What was the original price?',
    options: ['$75', '$80', '$85', '$72'],
    correctIndex: 1,
    explanation: 'If the discounted price is 75% of original: $60 / 0.75 = $80.'
  },
  {
    id: 19,
    category: 'NUMERICAL',
    question: 'What is the next prime number after 29?',
    options: ['30', '31', '33', '37'],
    correctIndex: 1,
    explanation: '31 is the next prime after 29. (30 = 2×15, 31 is not divisible by 2, 3, or 5).'
  },
  {
    id: 20,
    category: 'NUMERICAL',
    question: 'If a train travels 300 km in 2.5 hours, what is its average speed?',
    options: ['100 km/h', '110 km/h', '120 km/h', '130 km/h'],
    correctIndex: 2,
    explanation: 'Speed = Distance / Time = 300 / 2.5 = 120 km/h.'
  },

  // ── Verbal Intelligence (5) ──────────────────
  {
    id: 21,
    category: 'VERBAL',
    question: 'ELATED is to HAPPY as MELANCHOLY is to:',
    options: ['Angry', 'Sad', 'Excited', 'Confused'],
    correctIndex: 1,
    explanation: 'Elated is a strong form of happy; melancholy is a deep form of sadness.'
  },
  {
    id: 22,
    category: 'VERBAL',
    question: 'Which word does NOT belong: Apple, Banana, Carrot, Mango?',
    options: ['Apple', 'Banana', 'Carrot', 'Mango'],
    correctIndex: 2,
    explanation: 'Carrot is a vegetable; the rest are fruits.'
  },
  {
    id: 23,
    category: 'VERBAL',
    question: 'BOOK is to READING as FORK is to:',
    options: ['Drawing', 'Eating', 'Cooking', 'Writing'],
    correctIndex: 1,
    explanation: 'A book is the primary tool for reading; a fork is the primary tool for eating.'
  },
  {
    id: 24,
    category: 'VERBAL',
    question: 'What is the opposite of "BENEVOLENT"?',
    options: ['Generous', 'Malevolent', 'Ambivalent', 'Equivalent'],
    correctIndex: 1,
    explanation: 'Benevolent means kind/charitable; malevolent means having evil intent — they are antonyms.'
  },
  {
    id: 25,
    category: 'VERBAL',
    question: 'Choose the word that best completes the analogy: Pen : Write :: Scissors : __',
    options: ['Paper', 'Cut', 'Sharp', 'Blade'],
    correctIndex: 1,
    explanation: 'A pen is used to write; scissors are used to cut. The relationship is tool : action.'
  },

  // ── Memory & Attention (5) ──────────────────
  {
    id: 26,
    category: 'MEMORY',
    question: 'If the sequence is RED, BLUE, GREEN, YELLOW, RED, BLUE — what color comes next?',
    options: ['Yellow', 'Red', 'Green', 'Blue'],
    correctIndex: 2,
    explanation: 'The pattern repeats: RED, BLUE, GREEN, YELLOW. After the second BLUE comes GREEN.'
  },
  {
    id: 27,
    category: 'MEMORY',
    question: 'In the phrase "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG", how many words have exactly 3 letters?',
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'The 3-letter words are: THE, FOX, THE = 3 words (THE appears twice, FOX once).'
  },
  {
    id: 28,
    category: 'MEMORY',
    question: 'Which number appears twice in this list: 14, 27, 33, 14, 45, 27, 56?',
    options: ['Only 14', 'Only 27', 'Both 14 and 27', '33 and 45'],
    correctIndex: 2,
    explanation: '14 appears at positions 1 and 4; 27 appears at positions 2 and 6. Both appear twice.'
  },
  {
    id: 29,
    category: 'MEMORY',
    question: 'If today is Wednesday, what day was it 100 days ago?',
    options: ['Sunday', 'Monday', 'Saturday', 'Friday'],
    correctIndex: 0,
    explanation: '100 ÷ 7 = 14 remainder 2. Going back 2 days from Wednesday = Monday. Wait: 14×7=98, 100-98=2, Wednesday − 2 = Monday. Actually: counting back, Wed(0), Tue(-1), Mon(-2)... 100 mod 7 = 2, so it was Monday. Let me recalculate: 100/7 = 14 weeks + 2 days. Wednesday minus 2 days = Monday.'
  },
  {
    id: 30,
    category: 'MEMORY',
    question: 'Spot the error: "There are 12 months in a year, 52 weeks, 365 days, and 24 hours in a day." Is this statement correct?',
    options: [
      'Everything is correct',
      'The hours in a day is wrong',
      'The weeks in a year is wrong',
      'The days in a year is wrong'
    ],
    correctIndex: 0,
    explanation: 'All facts are correct: 12 months, ~52 weeks, 365 days (non-leap year), and 24 hours in a day.'
  }
];

// Shuffle utility (Fisher-Yates)
function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
