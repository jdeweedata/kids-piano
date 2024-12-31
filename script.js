const melodies = {
  twinkle: [
    {note: 'C4', duration: 500},
    {note: 'C4', duration: 500},
    {note: 'G4', duration: 500},
    {note: 'G4', duration: 500},
    {note: 'A4', duration: 500},
    {note: 'A4', duration: 500},
    {note: 'G4', duration: 1000},
    {note: 'F4', duration: 500},
    {note: 'F4', duration: 500},
    {note: 'E4', duration: 500},
    {note: 'E4', duration: 500},
    {note: 'D4', duration: 500},
    {note: 'D4', duration: 500},
    {note: 'C4', duration: 1000}
  ],
  mary: [
    {note: 'E4', duration: 500},
    {note: 'D4', duration: 500},
    {note: 'C4', duration: 500},
    {note: 'D4', duration: 500},
    {note: 'E4', duration: 500},
    {note: 'E4', duration: 500},
    {note: 'E4', duration: 1000},
    {note: 'D4', duration: 500},
    {note: 'D4', duration: 500},
    {note: 'D4', duration: 1000},
    {note: 'E4', duration: 500},
    {note: 'G4', duration: 500},
    {note: 'G4', duration: 1000}
  ],
  happy: [
    {note: 'C4', duration: 500},
    {note: 'C4', duration: 500},
    {note: 'D4', duration: 1000},
    {note: 'C4', duration: 1000},
    {note: 'F4', duration: 1000},
    {note: 'E4', duration: 2000},
    {note: 'C4', duration: 500},
    {note: 'C4', duration: 500},
    {note: 'D4', duration: 1000},
    {note: 'C4', duration: 1000},
    {note: 'G4', duration: 1000},
    {note: 'F4', duration: 2000}
  ],
  billie: [
    {note: 'C4', duration: 500},
    {note: 'D4', duration: 500},
    {note: 'F4', duration: 500},
    {note: 'D4', duration: 500},
    {note: 'E4', duration: 500},
    {note: 'D4', duration: 500},
    {note: 'C4', duration: 500},
    {note: 'D4', duration: 500},
    {note: 'F4', duration: 500},
    {note: 'D4', duration: 500},
    {note: 'E4', duration: 500},
    {note: 'D4', duration: 500},
    {note: 'C4', duration: 500},
    {note: 'D4', duration: 500},
    {note: 'F4', duration: 500},
    {note: 'D4', duration: 500},
    {note: 'E4', duration: 500},
    {note: 'D4', duration: 500}
  ]
};

class SynthKeyboard {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.oscillators = {};
    this.keys = document.querySelectorAll('.key');
    this.init();
  }

  init() {
    this.keys.forEach(key => {
      // Mouse events
      key.addEventListener('mousedown', () => this.playNote(key));
      key.addEventListener('mouseup', () => this.stopNote(key));
      key.addEventListener('mouseleave', () => this.stopNote(key));
      
      // Touch events
      key.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.playNote(key);
      });
      key.addEventListener('touchend', () => this.stopNote(key));
    });
  }

  playNote(key) {
    if (!key.classList.contains('active')) {
      const note = key.dataset.note;
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(this.getFrequency(note), this.audioContext.currentTime);
      oscillator.connect(this.audioContext.destination);
      oscillator.start();
      this.oscillators[note] = oscillator;
      key.classList.add('active');
      
      // Create star animation
      const star = document.createElement('div');
      star.classList.add('star');
      const rect = key.getBoundingClientRect();
      star.style.left = `${Math.random() * rect.width}px`;
      star.style.top = `${Math.random() * rect.height}px`;
      key.appendChild(star);
      
      // Create bouncing note
      const noteIcon = document.createElement('div');
      noteIcon.classList.add('note-icon');
      noteIcon.textContent = '🎵';
      noteIcon.style.left = `${Math.random() * rect.width}px`;
      noteIcon.style.top = `${Math.random() * rect.height}px`;
      key.appendChild(noteIcon);
      
      // Create confetti effect for correct notes in tutorial
      if (tutorialActive) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.textContent = '🎉';
        confetti.style.position = 'absolute';
        confetti.style.left = `${rect.left + rect.width/2}px`;
        confetti.style.top = `${rect.top}px`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1000);
      }
      
      // Remove animations after they complete
      star.addEventListener('animationend', () => star.remove());
      noteIcon.addEventListener('animationend', () => noteIcon.remove());
    }
  }

  stopNote(key) {
    const note = key.dataset.note;
    if (this.oscillators[note]) {
      this.oscillators[note].stop();
      delete this.oscillators[note];
      key.classList.remove('active');
    }
  }

  getFrequency(note) {
    const notes = {
      'C4': 261.63,
      'C#4': 277.18,
      'D4': 293.66,
      'D#4': 311.13,
      'E4': 329.63,
      'F4': 349.23,
      'F#4': 369.99,
      'G4': 392.00,
      'G#4': 415.30,
      'A4': 440.00,
      'A#4': 466.16,
      'B4': 493.88,
      'C5': 523.25
    };
    return notes[note] || 440;
  }
}

function playMelody(melodyName) {
  const melody = melodies[melodyName];
  if (!melody) return;

  const keyboard = new SynthKeyboard();
  let delay = 0;

  melody.forEach(({note, duration}, index) => {
    setTimeout(() => {
      const key = document.querySelector(`.key[data-note="${note}"]`);
      if (key) {
        // Highlight and play the note
        key.classList.add('highlighted');
        keyboard.playNote(key);
        
        // Remove highlight after note duration
        setTimeout(() => {
          key.classList.remove('highlighted');
          keyboard.stopNote(key);
        }, duration - 100);
      }
    }, delay);
    
    delay += duration;
  });
}

// Tutorial sequence
const tutorialSteps = [
  {note: 'C4', instruction: 'Let\'s start with C'},
  {note: 'D4', instruction: 'Now play D'},
  {note: 'E4', instruction: 'Next is E'},
  {note: 'F4', instruction: 'Try F now'},
  {note: 'G4', instruction: 'Now play G'},
  {note: 'A4', instruction: 'Next is A'},
  {note: 'B4', instruction: 'Try B now'},
  {note: 'C5', instruction: 'Finish with high C'}
];

let currentStep = 0;
let tutorialActive = false;
let instructionElement;

function startTutorial() {
  tutorialActive = true;
  currentStep = 0;
  
  // Create instruction element if it doesn't exist
  if (!instructionElement) {
    instructionElement = document.createElement('div');
    instructionElement.classList.add('tutorial-instruction');
    document.body.appendChild(instructionElement);
  }
  
  // Start the first step
  nextTutorialStep();
}

function nextTutorialStep() {
  if (!tutorialActive) return;
  
  // Clear previous highlights
  document.querySelectorAll('.key').forEach(key => {
    key.classList.remove('tutorial-highlight');
  });
  
  if (currentStep >= tutorialSteps.length) {
    // Tutorial complete
    instructionElement.textContent = 'Great job! You completed the tutorial!';
    setTimeout(() => {
      instructionElement.remove();
      tutorialActive = false;
    }, 3000);
    return;
  }
  
  const step = tutorialSteps[currentStep];
  const key = document.querySelector(`.key[data-note="${step.note}"]`);
  
  if (key) {
    // Highlight the key
    key.classList.add('tutorial-highlight');
    
    // Show instruction
    instructionElement.textContent = step.instruction;
    
    // Listen for the correct note to be played
    const handleNote = () => {
      key.removeEventListener('mousedown', handleNote);
      key.removeEventListener('touchstart', handleNote);
      currentStep++;
      setTimeout(nextTutorialStep, 500);
    };
    
    key.addEventListener('mousedown', handleNote);
    key.addEventListener('touchstart', handleNote);
  }
}

// Initialize the keyboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SynthKeyboard();
});
