import Dexie from 'dexie';

export const db = new Dexie('PulseFitDB');

db.version(2).stores({
  logs: '++id, exerciseName, weight, reps, setType, date',
  routines: '++id, name, focus, exercises',
  customExercises: '++id, name, category, muscle'
});