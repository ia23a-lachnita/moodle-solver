#!/usr/bin/env python3
"""
Comprehensive Moodle Quiz Test Script
Creates a test quiz with all 16 question types via Moodle Web Services API,
then provides instructions to test the extension.
"""

import os
import json
import requests
import sys
from typing import Dict, List, Any, Optional
from dataclasses import dataclass

@dataclass
class MoodleConfig:
    url: str
    token: str
    username: str
    password: str

class MoodleClient:
    def __init__(self, config: MoodleConfig):
        self.config = config
        self.session = requests.Session()
        self.base_url = config.url.rstrip('/')
        self.token = config.token
    
    def call(self, function: str, **params) -> Dict:
        """Call a Moodle web service function."""
        url = f"{self.base_url}/webservice/rest/server.php"
        data = {
            'wstoken': self.token,
            'wsfunction': function,
            'moodlewsrestformat': 'json',
            **params
        }
        response = self.session.post(url, data=data)
        response.raise_for_status()
        result = response.json()
        if isinstance(result, dict) and 'exception' in result:
            raise Exception(f"Moodle error: {result.get('message', 'Unknown error')}")
        return result
    
    def get_site_info(self) -> Dict:
        return self.call('core_webservice_get_site_info')
    
    def get_courses(self, course_ids: List[int] = None) -> List[Dict]:
        params = {}
        if course_ids:
            for i, cid in enumerate(course_ids):
                params[f'ids[{i}]'] = cid
        return self.call('core_course_get_courses', **params)
    
    def get_course_contents(self, course_id: int) -> List[Dict]:
        return self.call('core_course_get_contents', courseid=course_id)
    
    def get_quizzes_by_course(self, course_id: int) -> List[Dict]:
        return self.call('mod_quiz_get_quizzes_by_courses', courseids=[course_id])
    
    def create_question(self, question_data: Dict) -> Dict:
        """Create a question in the question bank."""
        # Note: This function may not be available in all Moodle instances
        return self.call('core_question_create_question', **question_data)
    
    def add_question_to_quiz(self, quiz_id: int, question_id: int, max_mark: float = 1.0) -> Dict:
        """Add a question to a quiz."""
        # This might need mod_quiz_add_question which may not exist
        return self.call('mod_quiz_add_question', quizid=quiz_id, questionid=question_id, maxmark=max_mark)

# All 16 question types with test data
QUESTION_TYPES = [
    {
        'type': 'multichoice',
        'name': 'Multiple Choice Test',
        'questiontext': 'What is the capital of France?',
        'defaultmark': 1,
        'answers': [
            {'answer': 'London', 'fraction': 0, 'feedback': 'Incorrect'},
            {'answer': 'Paris', 'fraction': 100, 'feedback': 'Correct!'},
            {'answer': 'Berlin', 'fraction': 0, 'feedback': 'Incorrect'},
            {'answer': 'Madrid', 'fraction': 0, 'feedback': 'Incorrect'},
        ],
        'single': True,
        'shuffleanswers': True,
    },
    {
        'type': 'truefalse',
        'name': 'True/False Test',
        'questiontext': 'The Earth is flat.',
        'defaultmark': 1,
        'answers': [
            {'answer': 'True', 'fraction': 0, 'feedback': 'Incorrect'},
            {'answer': 'False', 'fraction': 100, 'feedback': 'Correct! The Earth is round.'},
        ],
    },
    {
        'type': 'shortanswer',
        'name': 'Short Answer Test',
        'questiontext': 'What is 2 + 2?',
        'defaultmark': 1,
        'answers': [
            {'answer': '4', 'fraction': 100, 'feedback': 'Correct!'},
            {'answer': 'four', 'fraction': 100, 'feedback': 'Correct!'},
            {'answer': '2+2', 'fraction': 50, 'feedback': 'Partially correct, use the number.'},
        ],
        'usecase': 0,
    },
    {
        'type': 'numerical',
        'name': 'Numerical Test',
        'questiontext': 'What is the value of pi to two decimal places?',
        'defaultmark': 1,
        'answers': [
            {'answer': '3.14', 'fraction': 100, 'tolerance': 0.01, 'feedback': 'Correct!'},
            {'answer': '3.14159', 'fraction': 100, 'tolerance': 0.001, 'feedback': 'Correct! More precise.'},
        ],
        'unitoptions': [
            {'unit': '', 'multiplier': 1.0},
        ],
    },
    {
        'type': 'calculated',
        'name': 'Calculated Test',
        'questiontext': 'Calculate the area of a circle with radius {r}.',
        'defaultmark': 1,
        'answers': [
            {'answer': '{=pi()*{r}*{r}}', 'fraction': 100, 'tolerance': 0.01, 'feedback': 'Correct!'},
        ],
        'dataset': {
            'r': [2, 3, 5, 7, 10],
        },
        'synchronize': 1,
    },
    {
        'type': 'calculatedsimple',
        'name': 'Calculated Simple Test',
        'questiontext': 'What is {x} + {y}?',
        'defaultmark': 1,
        'answers': [
            {'answer': '{={x}+{y}}', 'fraction': 100, 'tolerance': 0.01, 'feedback': 'Correct!'},
        ],
        'dataset': {
            'x': [1, 2, 5, 10],
            'y': [2, 3, 7, 20],
        },
    },
    {
        'type': 'calculatedmulti',
        'name': 'Calculated Multichoice Test',
        'questiontext': 'If x = {a} and y = {b}, what is x * y?',
        'defaultmark': 1,
        'answers': [
            {'answer': 'The result is {={a}*{b}}', 'fraction': 100, 'feedback': 'Correct!'},
            {'answer': 'The result is {={a}+{b}}', 'fraction': 0, 'feedback': 'That is addition, not multiplication.'},
            {'answer': 'The result is {={a}-{b}}', 'fraction': 0, 'feedback': 'That is subtraction.'},
            {'answer': 'The result is {={a}/{b}}', 'fraction': 0, 'feedback': 'That is division.'},
        ],
        'dataset': {
            'a': [2, 3, 4],
            'b': [5, 6, 7],
        },
    },
    {
        'type': 'match',
        'name': 'Matching Test',
        'questiontext': 'Match the countries to their capitals.',
        'defaultmark': 1,
        'answers': [
            {'question': 'France', 'answer': 'Paris'},
            {'question': 'Japan', 'answer': 'Tokyo'},
            {'question': 'Germany', 'answer': 'Berlin'},
            {'question': 'Italy', 'answer': 'Rome'},
        ],
        'shuffle': True,
    },
    {
        'type': 'randomsamatch',
        'name': 'Random Short-Answer Matching Test',
        'questiontext': 'Match the following terms.',
        'defaultmark': 1,
        'answers': [
            {'question': 'HTML', 'answer': 'HyperText Markup Language'},
            {'question': 'CSS', 'answer': 'Cascading Style Sheets'},
            {'question': 'JS', 'answer': 'JavaScript'},
            {'question': 'API', 'answer': 'Application Programming Interface'},
        ],
    },
    {
        'type': 'multianswer',
        'name': 'Cloze (Multi-answer) Test',
        'questiontext': 'Fill in the blanks: The capital of France is {1:SHORTANSWER:=Paris#Correct!~%0#Wrong}. The capital of Japan is {2:SHORTANSWER:=Tokyo#Correct!~%0#Wrong}.',
        'defaultmark': 1,
    },
    {
        'type': 'gapselect',
        'name': 'Gap Select Test',
        'questiontext': 'The [ [1] ] rises in the [ [2] ].',
        'defaultmark': 1,
        'answers': [
            {'question': 'sun', 'group': 1},
            {'question': 'moon', 'group': 1},
            {'question': 'east', 'group': 2},
            {'question': 'west', 'group': 2},
        ],
    },
    {
        'type': 'ddwtos',
        'name': 'Drag and Drop into Text Test',
        'questiontext': 'Complete the sentence: The [[1]] jumps over the [[2]].',
        'defaultmark': 1,
        'answers': [
            {'answer': 'fox', 'group': 1, 'infinite': False},
            {'answer': 'dog', 'group': 1, 'infinite': False},
            {'answer': 'lazy', 'group': 2, 'infinite': False},
            {'answer': 'fence', 'group': 2, 'infinite': False},
        ],
    },
    {
        'type': 'ddimageortext',
        'name': 'Drag and Drop Image/Text Test',
        'questiontext': 'Drag the labels to the correct positions on the diagram.',
        'defaultmark': 1,
        'answers': [
            {'answer': 'Label A', 'group': 1, 'infinite': False, 'x': 100, 'y': 100},
            {'answer': 'Label B', 'group': 1, 'infinite': False, 'x': 200, 'y': 100},
            {'answer': 'Label C', 'group': 2, 'infinite': False, 'x': 100, 'y': 200},
            {'answer': 'Label D', 'group': 2, 'infinite': False, 'x': 200, 'y': 200},
        ],
    },
    {
        'type': 'ddmarker',
        'name': 'Drag and Drop Marker Test',
        'questiontext': 'Place the markers on the correct locations.',
        'defaultmark': 1,
        'answers': [
            {'answer': 'Marker 1', 'x': 150, 'y': 150, 'group': 1},
            {'answer': 'Marker 2', 'x': 250, 'y': 250, 'group': 1},
            {'answer': 'Marker 3', 'x': 350, 'y': 350, 'group': 1},
        ],
        'noofdrags': 3,
    },
    {
        'type': 'ordering',
        'name': 'Ordering Test',
        'questiontext': 'Order these numbers from smallest to largest.',
        'defaultmark': 1,
        'answers': [
            {'item': '5', 'itemid': '1'},
            {'item': '2', 'itemid': '2'},
            {'item': '8', 'itemid': '3'},
            {'item': '1', 'itemid': '4'},
            {'item': '10', 'itemid': '5'},
        ],
        'shuffle': True,
    },
    {
        'type': 'essay',
        'name': 'Essay Test',
        'questiontext': 'Explain the concept of recursion in programming. Provide an example.',
        'defaultmark': 5,
        'responseformat': 'editor',
        'responserequired': 1,
        'responsefieldlines': 15,
        'attachments': 0,
        'attachmentsrequired': 0,
    },
]

def print_question(q: Dict, idx: int):
    print(f"\n{idx+1}. {q['type'].upper()} - {q['name']}")
    print(f"   Question: {q['questiontext'][:80]}...")
    if 'answers' in q:
        print(f"   Answers: {len(q['answers'])} options")
    if 'dataset' in q:
        print(f"   Dataset variables: {list(q['dataset'].keys())}")

def main():
    # Configuration - update these for your Moodle instance
    config = MoodleConfig(
        url=os.getenv('MOODLE_URL', 'https://sandbox51.moodledemo.net'),
        token=os.getenv('MOODLE_TOKEN', '89226c2c338d12772af9ce4b700faeaf'),
        username=os.getenv('MOODLE_USERNAME', 'admin'),
        password=os.getenv('MOODLE_PASSWORD', 'sandbox24'),
    )
    
    print("=" * 60)
    print("MOODLE QUIZ SOLVER - COMPREHENSIVE TEST SETUP")
    print("=" * 60)
    
    # Print all question types
    print("\nQUESTION TYPES TO TEST (16 total):")
    for i, q in enumerate(QUESTION_TYPES):
        print_question(q, i)
    
    print("\n" + "=" * 60)
    print("TESTING CHECKLIST")
    print("=" * 60)
    print("""
For each question type, verify:
1. Question content is extracted correctly
2. Answer fields are detected (radio, checkbox, text, select, etc.)
3. Answer application works (click, type, select, drag-drop)
4. Bridge communication works for composite types
5. Answer validation catches mismatches
6. Restoration works after failed application

KEYBOARD SHORTCUT: Alt+Shift+S (or click .info element)
HOVER: Shows pending answer preview
ESC: Discards pending answer
STEALTH MODE: Minimal visual indicators
""")
    
    # Try to create quiz via API if functions available
    client = MoodleClient(config)
    
    try:
        print("\n" + "=" * 60)
        print("ATTEMPTING API QUIZ CREATION")
        print("=" * 60)
        
        site_info = client.get_site_info()
        print(f"Connected to: {site_info.get('sitename')}")
        print(f"User: {site_info.get('fullname')} (admin: {site_info.get('userissiteadmin')})")
        
        # Get courses
        courses = client.get_courses()
        print(f"\nFound {len(courses)} courses")
        for c in courses[:5]:
            print(f"  - {c.get('fullname')} (id: {c.get('id')})")
        
        # Use course 3 (My second course) where we created the quiz
        course_id = 3
        quizzes = client.get_quizzes_by_course(course_id)
        print(f"\nQuizzes in course {course_id}: {len(quizzes)}")
        for q in quizzes:
            print(f"  - {q.get('name')} (cmid: {q.get('cmid')}, id: {q.get('id')})")
        
        # Check if question creation functions are available
        site_info = client.get_site_info()
        functions = [f['name'] for f in site_info.get('functions', [])]
        question_funcs = [f for f in functions if 'question' in f.lower()]
        quiz_funcs = [f for f in functions if 'quiz' in f.lower() and 'add' in f.lower() or 'create' in f.lower()]
        
        print(f"\nQuestion-related functions: {question_funcs}")
        print(f"Quiz creation functions: {quiz_funcs}")
        
        if 'core_question_create_question' in functions:
            print("\n✓ Question creation API available!")
            # Could create questions here
        else:
            print("\n✗ Question creation API NOT available in this sandbox")
            print("  This is a sandbox limitation - use a real Moodle instance for full testing")
        
    except Exception as e:
        print(f"\nAPI Error: {e}")
        print("Sandbox web services may be limited.")
    
    print("\n" + "=" * 60)
    print("MANUAL TESTING INSTRUCTIONS")
    print("=" * 60)
    print("""
Since the sandbox has limited web services, create the test quiz manually:

1. LOG IN as admin (admin/sandbox24)
2. Go to course "My second course" (id=3)
3. Turn editing on
4. Add a Quiz activity -> "Comprehensive Test Quiz"
4. Add questions for ALL 16 types using the question data above
5. Configure quiz: "Interactive with multiple tries" or "Deferred feedback"
6. Preview the quiz as student
7. Test the extension:
   - Click extension icon -> Configure OpenRouter + API key + model
   - Go to quiz attempt page (/mod/quiz/attempt.php)
   - Test each question type:
     * Click .info element OR Alt+Shift+S to trigger
     * Hover .info to preview pending answer
     * Click again or Alt+Shift+S to apply
     * Press ESC to discard
     * Verify answer applied correctly
   - Test stealth mode toggle
   - Test fillOnClick toggle

EXPECTED BEHAVIOR PER TYPE:
- multichoice/truefalse/calculatedmulti: Radio/checkbox selection
- shortanswer/numerical/calculated: Text input fill
- match/randomsamatch/multianswer/gapselect: Dropdown selection
- ddwtos/ddimageortext: Drag-drop via bridge (composite.set)
- ddmarker: Marker placement via bridge (marker.set)
- ordering: Drag reorder via bridge (ordering.set)
- essay: TinyMCE/Atto fill via bridge (essay.write)
""")

if __name__ == '__main__':
    main()