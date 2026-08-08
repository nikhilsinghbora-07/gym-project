import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { 
  Play, Plus, Check, Trash2, Dumbbell, Clock, Flame, 
  Search, Timer, X, BarChart2, PlusCircle, BookmarkPlus, Edit3 
} from 'lucide-react';
import confetti from 'canvas-confetti';

// TOTAL EXERCISE DATABASE - EVERY MACHINE & EQUIPMENT VARIATION
const EXERCISE_DATABASE = [
  // CHEST
  { name: 'Bench Press (Barbell)', muscle: 'Chest', equipment: 'Barbell' },
  { name: 'Incline Bench Press (Barbell)', muscle: 'Chest', equipment: 'Barbell' },
  { name: 'Decline Bench Press (Barbell)', muscle: 'Chest', equipment: 'Barbell' },
  { name: 'Flat Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell' },
  { name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell' },
  { name: 'Decline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell' },
  { name: 'Chest Press Machine (Selectorized/Pin)', muscle: 'Chest', equipment: 'Machine' },
  { name: 'Incline Chest Press Machine (Pin)', muscle: 'Chest', equipment: 'Machine' },
  { name: 'Decline Chest Press Machine (Pin)', muscle: 'Chest', equipment: 'Machine' },
  { name: 'Plate-Loaded Flat Chest Press (Hammer Strength)', muscle: 'Chest', equipment: 'Machine' },
  { name: 'Plate-Loaded Incline Chest Press (Hammer Strength)', muscle: 'Chest', equipment: 'Machine' },
  { name: 'Plate-Loaded Decline Chest Press (Hammer Strength)', muscle: 'Chest', equipment: 'Machine' },
  { name: 'Smith Machine Flat Bench Press', muscle: 'Chest', equipment: 'Machine' },
  { name: 'Smith Machine Incline Bench Press', muscle: 'Chest', equipment: 'Machine' },
  { name: 'Smith Machine Decline Bench Press', muscle: 'Chest', equipment: 'Machine' },
  { name: 'Pec Deck / Butterfly Machine Fly', muscle: 'Chest', equipment: 'Machine' },
  { name: 'Cable Chest Fly (High-to-Low / Lower Chest)', muscle: 'Chest', equipment: 'Cable' },
  { name: 'Cable Chest Fly (Low-to-High / Upper Chest)', muscle: 'Chest', equipment: 'Cable' },
  { name: 'Cable Chest Fly (Middle / Standing)', muscle: 'Chest', equipment: 'Cable' },
  { name: 'Flat Dumbbell Fly', muscle: 'Chest', equipment: 'Dumbbell' },
  { name: 'Incline Dumbbell Fly', muscle: 'Chest', equipment: 'Dumbbell' },
  { name: 'Decline Dumbbell Fly', muscle: 'Chest', equipment: 'Dumbbell' },
  { name: 'Chest Dips (Parallel Bars)', muscle: 'Chest', equipment: 'Bodyweight' },
  { name: 'Assisted Dip Machine (Chest Focus)', muscle: 'Chest', equipment: 'Machine' },
  { name: 'Push-ups (Standard)', muscle: 'Chest', equipment: 'Bodyweight' },
  { name: 'Incline Push-ups', muscle: 'Chest', equipment: 'Bodyweight' },
  { name: 'Decline Push-ups', muscle: 'Chest', equipment: 'Bodyweight' },
  { name: 'Resistance Band Chest Press', muscle: 'Chest', equipment: 'Bands' },
  { name: 'Resistance Band Chest Fly', muscle: 'Chest', equipment: 'Bands' },
  { name: 'Svend Press / Plate Press', muscle: 'Chest', equipment: 'Plate' },

  // LATS & BACK
  { name: 'Lat Pulldown (Wide Grip Cable)', muscle: 'Back', equipment: 'Cable' },
  { name: 'Lat Pulldown (Close Grip / Neutral Cable)', muscle: 'Back', equipment: 'Cable' },
  { name: 'Lat Pulldown (Reverse / Underhand Cable)', muscle: 'Back', equipment: 'Cable' },
  { name: 'Single Arm Cable Lat Pulldown', muscle: 'Back', equipment: 'Cable' },
  { name: 'Lat Pulldown Machine (Pin Selected)', muscle: 'Back', equipment: 'Machine' },
  { name: 'Plate-Loaded Front Lat Pulldown', muscle: 'Back', equipment: 'Machine' },
  { name: 'Pull-ups (Wide Grip)', muscle: 'Back', equipment: 'Bodyweight' },
  { name: 'Chin-ups (Underhand Grip)', muscle: 'Back', equipment: 'Bodyweight' },
  { name: 'Assisted Pull-up Machine', muscle: 'Back', equipment: 'Machine' },
  { name: 'Seated Cable Row (Close Grip)', muscle: 'Back', equipment: 'Cable' },
  { name: 'Seated Cable Row (Wide Grip)', muscle: 'Back', equipment: 'Cable' },
  { name: 'Seated Cable Row (Single Arm)', muscle: 'Back', equipment: 'Cable' },
  { name: 'Seated Row Machine (Selectorized)', muscle: 'Back', equipment: 'Machine' },
  { name: 'Plate-Loaded Seated Row (Hammer Strength)', muscle: 'Back', equipment: 'Machine' },
  { name: 'T-Bar Row Machine (Chest Supported)', muscle: 'Back', equipment: 'Machine' },
  { name: 'Barbell T-Bar Row (Landmine)', muscle: 'Back', equipment: 'Barbell' },
  { name: 'Barbell Bent Over Row', muscle: 'Back', equipment: 'Barbell' },
  { name: 'Barbell Pendlay Row', muscle: 'Back', equipment: 'Barbell' },
  { name: 'Smith Machine Bent Over Row', muscle: 'Back', equipment: 'Machine' },
  { name: 'Dumbbell Single Arm Row', muscle: 'Back', equipment: 'Dumbbell' },
  { name: 'Two-Arm Dumbbell Row (Bench Supported)', muscle: 'Back', equipment: 'Dumbbell' },
  { name: 'Kettlebell Gorilla Row', muscle: 'Back', equipment: 'Kettlebell' },
  { name: 'Straight Arm Lat Pulldown (Cable Rope/Bar)', muscle: 'Back', equipment: 'Cable' },
  { name: 'Face Pulls (Cable)', muscle: 'Back', equipment: 'Cable' },
  { name: 'Deadlift (Barbell Conventional)', muscle: 'Back', equipment: 'Barbell' },
  { name: 'Sumo Deadlift (Barbell)', muscle: 'Back', equipment: 'Barbell' },
  { name: 'Trap Bar / Hex Bar Deadlift', muscle: 'Back', equipment: 'Barbell' },
  { name: 'Rack Pulls (Barbell)', muscle: 'Back', equipment: 'Barbell' },
  { name: 'Hyperextensions / Back Extension Bench', muscle: 'Back', equipment: 'Bodyweight' },
  { name: 'Lower Back Extension Machine', muscle: 'Back', equipment: 'Machine' },
  { name: 'Good Mornings (Barbell)', muscle: 'Back', equipment: 'Barbell' },

  // LEGS
  { name: 'Barbell Back Squat', muscle: 'Legs', equipment: 'Barbell' },
  { name: 'Barbell Front Squat', muscle: 'Legs', equipment: 'Barbell' },
  { name: 'Smith Machine Squat', muscle: 'Legs', equipment: 'Machine' },
  { name: '45-Degree Leg Press Machine', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Horizontal Leg Press Machine (Pin)', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Hack Squat Machine', muscle: 'Legs', equipment: 'Machine' },
  { name: 'V-Squat Machine', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Pendulum Squat Machine', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Goblet Squat (Dumbbell/Kettlebell)', muscle: 'Legs', equipment: 'Dumbbell' },
  { name: 'Leg Extensions Machine (Quads)', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Single Arm / Single Leg Extension Machine', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Bulgarian Split Squat (Dumbbell)', muscle: 'Legs', equipment: 'Dumbbell' },
  { name: 'Smith Machine Bulgarian Split Squat', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Walking Lunges (Dumbbell/Barbell)', muscle: 'Legs', equipment: 'Dumbbell' },
  { name: 'Reverse Lunges', muscle: 'Legs', equipment: 'Dumbbell' },
  { name: 'Step-ups (Dumbbell/Box)', muscle: 'Legs', equipment: 'Dumbbell' },
  { name: 'Barbell Romanian Deadlift (RDL)', muscle: 'Legs', equipment: 'Barbell' },
  { name: 'Dumbbell RDL', muscle: 'Legs', equipment: 'Dumbbell' },
  { name: 'Smith Machine RDL', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Lying Leg Curl Machine (Hamstrings)', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Seated Leg Curl Machine (Hamstrings)', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Standing Single Leg Curl Machine', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Barbell Hip Thrust', muscle: 'Legs', equipment: 'Barbell' },
  { name: 'Hip Thrust Machine (Plate-Loaded/Pin)', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Smith Machine Hip Thrust', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Cable Glute Kickbacks', muscle: 'Legs', equipment: 'Cable' },
  { name: 'Hip Abductor Machine (Outer Thigh)', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Hip Adductor Machine (Inner Thigh)', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Standing Calf Raise Machine', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Seated Calf Raise Machine', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Leg Press Calf Raise', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Smith Machine Calf Raise', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Dumbbell Single Leg Calf Raise', muscle: 'Legs', equipment: 'Dumbbell' },

  // SHOULDERS
  { name: 'Overhead Press (Barbell OHP)', muscle: 'Shoulders', equipment: 'Barbell' },
  { name: 'Seated Dumbbell Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Seated Shoulder Press Machine (Pin)', muscle: 'Shoulders', equipment: 'Machine' },
  { name: 'Plate-Loaded Shoulder Press (Hammer Strength)', muscle: 'Shoulders', equipment: 'Machine' },
  { name: 'Smith Machine Shoulder Press', muscle: 'Shoulders', equipment: 'Machine' },
  { name: 'Arnold Press (Dumbbell)', muscle: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Dumbbell Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Cable Lateral Raise (Single Arm)', muscle: 'Shoulders', equipment: 'Cable' },
  { name: 'Lateral Raise Machine', muscle: 'Shoulders', equipment: 'Machine' },
  { name: 'Resistance Band Lateral Raise', muscle: 'Shoulders', equipment: 'Bands' },
  { name: 'Dumbbell Front Raise', muscle: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Barbell / Plate Front Raise', muscle: 'Shoulders', equipment: 'Plate' },
  { name: 'Cable Front Raise (Rope/Bar)', muscle: 'Shoulders', equipment: 'Cable' },
  { name: 'Reverse Pec Deck Machine (Rear Delt)', muscle: 'Shoulders', equipment: 'Machine' },
  { name: 'Dumbbell Bent-Over Rear Delt Fly', muscle: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Cable Rear Delt Fly (Cross Cable)', muscle: 'Shoulders', equipment: 'Cable' },
  { name: 'Barbell Shrugs (Traps)', muscle: 'Shoulders', equipment: 'Barbell' },
  { name: 'Dumbbell Shrugs', muscle: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Cable Shrugs', muscle: 'Shoulders', equipment: 'Cable' },
  { name: 'Smith Machine Shrugs', muscle: 'Shoulders', equipment: 'Machine' },

  // BICEPS & FOREARMS
  { name: 'Barbell Biceps Curl', muscle: 'Biceps', equipment: 'Barbell' },
  { name: 'EZ-Bar Biceps Curl', muscle: 'Biceps', equipment: 'Barbell' },
  { name: 'Dumbbell Biceps Curl', muscle: 'Biceps', equipment: 'Dumbbell' },
  { name: 'Dumbbell Hammer Curl', muscle: 'Biceps', equipment: 'Dumbbell' },
  { name: 'Cable Hammer Curl (Rope)', muscle: 'Biceps', equipment: 'Cable' },
  { name: 'Incline Dumbbell Curl', muscle: 'Biceps', equipment: 'Dumbbell' },
  { name: 'Preacher Curl (EZ-Bar)', muscle: 'Biceps', equipment: 'Barbell' },
  { name: 'Biceps Preacher Curl Machine (Pin/Plate)', muscle: 'Biceps', equipment: 'Machine' },
  { name: 'Cable Biceps Curl (Straight/EZ Bar)', muscle: 'Biceps', equipment: 'Cable' },
  { name: 'Single Arm High Cable Curl', muscle: 'Biceps', equipment: 'Cable' },
  { name: 'Concentration Curl (Dumbbell)', muscle: 'Biceps', equipment: 'Dumbbell' },
  { name: 'Spider Curl (Dumbbell/EZ-Bar)', muscle: 'Biceps', equipment: 'Dumbbell' },
  { name: 'Reverse Grip Barbell Curl (Forearms)', muscle: 'Biceps', equipment: 'Barbell' },
  { name: 'Wrist Curls (Barbell/Dumbbell)', muscle: 'Biceps', equipment: 'Barbell' },
  { name: 'Reverse Wrist Curls', muscle: 'Biceps', equipment: 'Barbell' },

  // TRICEPS
  { name: 'Triceps Pushdown (Rope Attachment)', muscle: 'Triceps', equipment: 'Cable' },
  { name: 'Triceps Pushdown (Straight / V-Bar)', muscle: 'Triceps', equipment: 'Cable' },
  { name: 'Single Arm Reverse Cable Pushdown', muscle: 'Triceps', equipment: 'Cable' },
  { name: 'Triceps Extension Machine (Selectorized)', muscle: 'Triceps', equipment: 'Machine' },
  { name: 'Skull Crushers (EZ-Bar)', muscle: 'Triceps', equipment: 'Barbell' },
  { name: 'Skull Crushers (Dumbbell)', muscle: 'Triceps', equipment: 'Dumbbell' },
  { name: 'Overhead Dumbbell Triceps Extension', muscle: 'Triceps', equipment: 'Dumbbell' },
  { name: 'Overhead Cable Triceps Extension (Rope)', muscle: 'Triceps', equipment: 'Cable' },
  { name: 'Close-Grip Bench Press (Barbell)', muscle: 'Triceps', equipment: 'Barbell' },
  { name: 'Smith Machine Close-Grip Bench Press', muscle: 'Triceps', equipment: 'Machine' },
  { name: 'Triceps Dips (Parallel Bars)', muscle: 'Triceps', equipment: 'Bodyweight' },
  { name: 'Bench Dips', muscle: 'Triceps', equipment: 'Bodyweight' },
  { name: 'Assisted Dip Machine (Triceps Focus)', muscle: 'Triceps', equipment: 'Machine' },
  { name: 'Dumbbell Kickbacks', muscle: 'Triceps', equipment: 'Dumbbell' },

  // ABS & CORE
  { name: 'Crunches', muscle: 'Abs', equipment: 'Bodyweight' },
  { name: 'Decline Bench Crunches', muscle: 'Abs', equipment: 'Bodyweight' },
  { name: 'Ab Crunch Machine (Selectorized)', muscle: 'Abs', equipment: 'Machine' },
  { name: 'Cable Crunch (Kneeling Rope)', muscle: 'Abs', equipment: 'Cable' },
  { name: 'Hanging Leg Raise', muscle: 'Abs', equipment: 'Bodyweight' },
  { name: 'Hanging Knee Raise', muscle: 'Abs', equipment: 'Bodyweight' },
  { name: 'Captain’s Chair Leg/Knee Raise', muscle: 'Abs', equipment: 'Bodyweight' },
  { name: 'Ab Wheel Rollout', muscle: 'Abs', equipment: 'Bodyweight' },
  { name: 'Plank', muscle: 'Abs', equipment: 'Bodyweight' },
  { name: 'Side Plank', muscle: 'Abs', equipment: 'Bodyweight' },
  { name: 'Cable Woodchopper (Obliques)', muscle: 'Abs', equipment: 'Cable' },
  { name: 'Russian Twists', muscle: 'Abs', equipment: 'Bodyweight' },
  { name: 'Lying Leg Raises', muscle: 'Abs', equipment: 'Bodyweight' }
];

export default function App() {
  // --- SUPABASE AUTH STATE ---
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password , options :{emailRedirectTo : window.location.origin}
      });
      if (error) alert(error.message);
      else alert('Account created! Check your email to confirm.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
  };

  const handleSignOut = () => {
    supabase.auth.signOut();
  };

  const [activeTab, setActiveTab] = useState('workout'); 
  const [activeWorkout, setActiveWorkout] = useState(null); 
  const [workoutTime, setWorkoutTime] = useState(0);
  
  // Exercise Selector Modal
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exercisePickerTarget, setExercisePickerTarget] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');

  // Custom Routine Creator & Editor Modal
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [editingRoutineId, setEditingRoutineId] = useState(null);
  const [newRoutineTitle, setNewRoutineTitle] = useState('');
  const [routineExercises, setRoutineExercises] = useState([]);

  // Rest Timer
  const [restTimer, setRestTimer] = useState(null);
  const [isResting, setIsResting] = useState(false);

  // Database Queries
  const historyLogs = useLiveQuery(() => db.logs.orderBy('date').reverse().toArray()) || [];
  const savedRoutines = useLiveQuery(() => db.routines.toArray()) || [];

  // Workout Session Timer
  useEffect(() => {
    let interval = null;
    if (activeWorkout) {
      interval = setInterval(() => setWorkoutTime(prev => prev + 1), 1000);
    } else {
      setWorkoutTime(0);
    }
    return () => clearInterval(interval);
  }, [activeWorkout]);

  // Rest Timer Countdown
  useEffect(() => {
    let timer = null;
    if (isResting && restTimer > 0) {
      timer = setInterval(() => setRestTimer(prev => prev - 1), 1000);
    } else if (restTimer === 0) {
      setIsResting(false);
    }
    return () => clearInterval(timer);
  }, [isResting, restTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getLastPerformance = (exerciseName) => {
    const pastLogs = historyLogs.filter(log => log.exerciseName === exerciseName);
    if (pastLogs.length > 0) {
      return {
        kg: pastLogs[0].weight ? String(pastLogs[0].weight) : '',
        reps: pastLogs[0].reps ? String(pastLogs[0].reps) : ''
      };
    }
    return { kg: '', reps: '' };
  };

  const openExercisePicker = (target) => {
    setExercisePickerTarget(target);
    setSearchQuery('');
    setShowExerciseModal(true);
  };

  const handleSelectExercise = (exerciseName) => {
    const lastPerf = getLastPerformance(exerciseName);

    if (exercisePickerTarget === 'routine') {
      setRoutineExercises(prev => [
        ...prev,
        {
          name: exerciseName,
          sets: [
            { kg: lastPerf.kg, reps: lastPerf.reps, type: 'N', completed: false },
            { kg: lastPerf.kg, reps: lastPerf.reps, type: 'N', completed: false },
            { kg: lastPerf.kg, reps: lastPerf.reps, type: 'N', completed: false }
          ]
        }
      ]);
    } else if (exercisePickerTarget === 'workout' && activeWorkout) {
      setActiveWorkout(prev => ({
        ...prev,
        exercises: [
          ...prev.exercises,
          {
            name: exerciseName,
            sets: [{ kg: lastPerf.kg, reps: lastPerf.reps, type: 'N', completed: false }]
          }
        ]
      }));
    }
    setShowExerciseModal(false);
  };

  const startWorkoutSession = (routine) => {
    let exercisesToLoad = [];

    if (routine) {
      exercisesToLoad = routine.exercises.map(ex => {
        const lastPerf = getLastPerformance(ex.name);
        return {
          name: ex.name,
          sets: ex.sets.map(s => ({
            kg: s.kg || lastPerf.kg,
            reps: s.reps || lastPerf.reps,
            type: s.type || 'N',
            completed: false
          }))
        };
      });
    }

    setActiveWorkout({
      title: routine ? routine.name : 'Quick Workout',
      exercises: exercisesToLoad
    });
    setWorkoutTime(0);
  };

  const deleteWorkoutSet = (exIdx, setIdx) => {
    const updated = { ...activeWorkout };
    updated.exercises[exIdx].sets.splice(setIdx, 1);
    setActiveWorkout(updated);
  };

  const deleteRoutineSet = (exIdx, setIdx) => {
    const updated = [...routineExercises];
    updated[exIdx].sets.splice(setIdx, 1);
    setRoutineExercises(updated);
  };

  const addSetToRoutineDraft = (exIdx) => {
    const updated = [...routineExercises];
    const lastPerf = getLastPerformance(updated[exIdx].name);
    updated[exIdx].sets.push({ kg: lastPerf.kg, reps: lastPerf.reps, type: 'N', completed: false });
    setRoutineExercises(updated);
  };

  const openEditRoutineModal = (routine) => {
    setEditingRoutineId(routine.id);
    setNewRoutineTitle(routine.name);
    setRoutineExercises(JSON.parse(JSON.stringify(routine.exercises)));
    setShowRoutineModal(true);
  };

  const openNewRoutineModal = () => {
    setEditingRoutineId(null);
    setNewRoutineTitle('');
    setRoutineExercises([]);
    setShowRoutineModal(true);
  };

  const saveCustomRoutine = async () => {
    if (!newRoutineTitle.trim() || routineExercises.length === 0) return;

    if (editingRoutineId) {
      await db.routines.update(editingRoutineId, {
        name: newRoutineTitle,
        focus: `${routineExercises.length} Exercises`,
        exercises: routineExercises
      });
    } else {
      await db.routines.add({
        name: newRoutineTitle,
        focus: `${routineExercises.length} Exercises`,
        exercises: routineExercises
      });
    }

    setEditingRoutineId(null);
    setNewRoutineTitle('');
    setRoutineExercises([]);
    setShowRoutineModal(false);
  };

  const deleteRoutine = async (id) => {
    await db.routines.delete(id);
  };

  const addSetToWorkout = (exIdx) => {
    const updated = { ...activeWorkout };
    const prevSet = updated.exercises[exIdx].sets[updated.exercises[exIdx].sets.length - 1];
    const lastPerf = getLastPerformance(updated.exercises[exIdx].name);

    updated.exercises[exIdx].sets.push({
      kg: prevSet ? prevSet.kg : lastPerf.kg,
      reps: prevSet ? prevSet.reps : lastPerf.reps,
      type: 'N',
      completed: false
    });
    setActiveWorkout(updated);
  };

  const toggleSetComplete = (exIdx, setIdx) => {
    const updated = { ...activeWorkout };
    const currentSet = updated.exercises[exIdx].sets[setIdx];
    const newStatus = !currentSet.completed;
    currentSet.completed = newStatus;
    setActiveWorkout(updated);

    if (newStatus) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.85 } });
      setRestTimer(90);
      setIsResting(true);
    }
  };

  const finishWorkout = async () => {
    if (!activeWorkout) return;

    for (const ex of activeWorkout.exercises) {
      for (const set of ex.sets) {
        if (set.completed && set.kg && set.reps) {
          await db.logs.add({
            exerciseName: ex.name,
            weight: parseFloat(set.kg),
            reps: parseInt(set.reps, 10),
            setType: set.type,
            date: new Date().toISOString()
          });
        }
      }
    }

    setActiveWorkout(null);
    setIsResting(false);
    setActiveTab('history');
  };

  const filteredExercises = EXERCISE_DATABASE.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.muscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || ex.muscle === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-28 max-w-md mx-auto relative border-x border-zinc-800">
      
      {/* 1. REST TIMER BANNER */}
      {isResting && (
        <div className="bg-lime-400 text-black px-4 py-2 flex items-center justify-between sticky top-0 z-30 font-bold text-xs shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            <span>REST TIMER</span>
          </div>
          <span className="text-sm font-black font-mono">{formatTime(restTimer)}</span>
          <button onClick={() => setIsResting(false)} className="text-black hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      

      {/* 2. AUTHENTICATION CHECK */}
      {!user ? (
        /* LOGIN / CREATE ACCOUNT SCREEN */
        <div className="min-h-[85vh] flex flex-col items-center justify-center px-4">
          <div className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Dumbbell className="text-lime-400 w-8 h-8" />
              <h1 className="text-3xl font-black tracking-wider uppercase">HYPER<span className="text-lime-400">SET</span></h1>
            </div>
            <p className="text-zinc-400 text-sm mb-6">
              {isSignUp ? 'Create an account to track your workouts' : 'Welcome back! Sign in to continue'}
            </p>

            <form onSubmit={handleAuth} className="flex flex-col gap-4 text-left">
              <div>
                <label className="text-xs text-zinc-400 font-mono mb-1 block">EMAIL</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full bg-black border border-zinc-800 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-mono mb-1 block">PASSWORD</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full bg-black border border-zinc-800 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-lime-400"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-lime-400 text-black font-bold py-3 rounded-xl hover:bg-lime-300 transition-all mt-2 cursor-pointer"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-800">
              <button 
                type="button" 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        </div>
        
      ) : (
        <>
          {/* YOUR EXISTING HEADER */}
          <header className="p-4 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-20">
            <div className="flex items-center gap-2">
              <Dumbbell className="text-lime-400 w-6 h-6" />
              <h1 className="text-xl font-black tracking-wider uppercase">HYPER<span className="text-lime-400">SET</span></h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400">{user.email}</span>
              <button 
                onClick={handleSignOut} 
                className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </header>

      {/* MAIN CONTENT */}
      <main className="p-4">
        
        {/* ACTIVE WORKOUT SESSION */}
        {activeWorkout ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <input 
                  type="text" 
                  value={activeWorkout.title}
                  onChange={(e) => setActiveWorkout({ ...activeWorkout, title: e.target.value })}
                  className="bg-transparent text-xl font-black text-white focus:outline-none focus:border-b border-lime-400"
                />
                <p className="text-xs text-zinc-400 mt-0.5">{activeWorkout.exercises.length} Exercises Logged</p>
              </div>
              <div className="flex items-center gap-3">
  <button
    onClick={finishWorkout}
    className="text-xs text-lime-400 font-bold hover:underline">
    Finish
  </button>

  <button 
    onClick={() => setActiveWorkout(null)} 
    className="text-xs text-red-400 font-bold hover:underline">
    Discard
  </button>
</div>
            </div>

            {activeWorkout.exercises.map((ex, exIdx) => {
              const lastPerf = getLastPerformance(ex.name);
              return (
                <div key={exIdx} className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-lime-400">{ex.name}</h3>
                      {lastPerf.kg && (
                        <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                          Previous Best: <span className="text-zinc-300">{lastPerf.kg} kg × {lastPerf.reps} reps</span>
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        const updated = { ...activeWorkout };
                        updated.exercises.splice(exIdx, 1);
                        setActiveWorkout(updated);
                      }}
                      className="text-zinc-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-1.5 text-[10px] text-zinc-400 font-black tracking-wider text-center">
                      <span className="col-span-1">SET</span>
                      <span className="col-span-2">TYPE</span>
                      <span className="col-span-3">KG</span>
                      <span className="col-span-3">REPS</span>
                      <span className="col-span-2">✓</span>
                      <span className="col-span-1"></span>
                    </div>

                    {ex.sets.map((set, setIdx) => (
                      <div 
                        key={setIdx} 
                        className={`grid grid-cols-12 gap-1.5 items-center p-1.5 rounded-xl transition-all ${
                          set.completed ? 'bg-lime-950/30 border border-lime-500/30' : 'bg-zinc-800/40'
                        }`}>
                        
                        <span className="col-span-1 text-center text-xs font-bold text-zinc-400">
                          {setIdx + 1}
                        </span>

                        <button
                          onClick={() => {
                            const updated = { ...activeWorkout };
                            const types = ['N', 'W', 'D', 'F'];
                            const nextType = types[(types.indexOf(set.type) + 1) % types.length];
                            updated.exercises[exIdx].sets[setIdx].type = nextType;
                            setActiveWorkout(updated);
                          }}
                          className={`col-span-2 text-[10px] font-black h-7 rounded-lg flex items-center justify-center ${
                            set.type === 'W' ? 'bg-orange-500/20 text-orange-400' :
                            set.type === 'D' ? 'bg-purple-500/20 text-purple-400' :
                            set.type === 'F' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-300'
                          }`}>
                          {set.type}
                        </button>

                        <input
                          type="number"
                          placeholder={lastPerf.kg || "0"}
                          value={set.kg}
                          onChange={(e) => {
                            const updated = { ...activeWorkout };
                            updated.exercises[exIdx].sets[setIdx].kg = e.target.value;
                            setActiveWorkout(updated);
                          }}
                          className="col-span-3 bg-zinc-950 border border-zinc-700/60 rounded-lg py-1 text-center font-bold text-lime-400 text-xs focus:outline-none focus:border-lime-400"
                        />

                        <input
                          type="number"
                          placeholder={lastPerf.reps || "0"}
                          value={set.reps}
                          onChange={(e) => {
                            const updated = { ...activeWorkout };
                            updated.exercises[exIdx].sets[setIdx].reps = e.target.value;
                            setActiveWorkout(updated);
                          }}
                          className="col-span-3 bg-zinc-950 border border-zinc-700/60 rounded-lg py-1 text-center font-bold text-lime-400 text-xs focus:outline-none focus:border-lime-400"
                        />

                        <button
                          onClick={() => toggleSetComplete(exIdx, setIdx)}
                          className={`col-span-2 h-7 rounded-lg flex items-center justify-center transition-all ${
                            set.completed ? 'bg-lime-400 text-black' : 'bg-zinc-800 text-zinc-500'
                          }`}>
                          <Check className="w-4 h-4 stroke-[3px]" />
                        </button>

                        <button
                          onClick={() => deleteWorkoutSet(exIdx, setIdx)}
                          className="col-span-1 flex items-center justify-center text-zinc-600 hover:text-red-400 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addSetToWorkout(exIdx)}
                    className="w-full py-2 bg-zinc-800/60 hover:bg-zinc-800 rounded-xl text-xs font-bold text-zinc-300 flex items-center justify-center gap-1 transition-all">
                    <Plus className="w-3.5 h-3.5" /> Add Set
                  </button>
                </div>
              );
            })}

            <button
              onClick={() => openExercisePicker('workout')}
              className="w-full py-3.5 bg-zinc-900 border border-dashed border-zinc-700 rounded-2xl font-bold text-xs text-lime-400 flex items-center justify-center gap-2 hover:border-lime-400 transition-all">
              <PlusCircle className="w-4 h-4" /> ADD EXERCISE
            </button>
          </div>
        ) : (
          <>
            {/* WORKOUT TAB */}
            {activeTab === 'workout' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => startWorkoutSession(null)}
                    className="bg-lime-400 hover:bg-lime-300 text-black py-3.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-lime-400/10 transition-all">
                    <Play className="w-4 h-4 fill-black" /> QUICK WORKOUT
                  </button>

                  <button
                    onClick={openNewRoutineModal}
                    className="bg-zinc-900 border border-zinc-800 hover:border-lime-400/50 text-white py-3.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                    <BookmarkPlus className="w-4 h-4 text-lime-400" /> CREATE ROUTINE
                  </button>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">My Saved Routines</h2>
                  
                  {savedRoutines.length === 0 ? (
                    <div className="text-center py-8 bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl p-4">
                      <p className="text-xs text-zinc-500">No custom routines created yet.</p>
                      <button 
                        onClick={openNewRoutineModal} 
                        className="text-xs text-lime-400 font-bold mt-2 hover:underline">
                        + Create your first routine
                      </button>
                    </div>
                  ) : (
                    savedRoutines.map((routine) => (
                      <div key={routine.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-black text-white">{routine.name}</h3>
                            <p className="text-xs text-zinc-400 mt-0.5">{routine.focus}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openEditRoutineModal(routine)}
                              className="text-zinc-400 hover:text-lime-400 p-1.5 bg-zinc-800 rounded-lg transition-all"
                              title="Edit Routine">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteRoutine(routine.id)}
                              className="text-zinc-500 hover:text-red-400 p-1.5 bg-zinc-800 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1 bg-zinc-950/60 p-2.5 rounded-xl">
                          {routine.exercises.map((item, i) => (
                            <div key={i} className="text-xs text-zinc-300 flex items-center justify-between py-0.5">
                              <span>{item.name}</span>
                              <span className="text-zinc-500 text-[10px]">{item.sets.length} Sets</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => startWorkoutSession(routine)}
                          className="w-full bg-zinc-800 hover:bg-zinc-700 text-lime-400 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all">
                          <Play className="w-3.5 h-3.5 fill-lime-400" /> Start Routine
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* EXERCISES TAB */}
            {activeTab === 'exercises' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search exercise, machine, or muscle..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Abs'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMuscle(m)}
                      className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                        selectedMuscle === m ? 'bg-lime-400 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}>
                      {m}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    Found {filteredExercises.length} Movements
                  </p>
                  {filteredExercises.map((ex, i) => {
                    const lastPerf = getLastPerformance(ex.name);
                    return (
                      <div key={i} className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-white">{ex.name}</p>
                          <p className="text-xs text-zinc-400">{ex.muscle} • <span className="text-lime-400/90">{ex.equipment}</span></p>
                        </div>
                        {lastPerf.kg && (
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Last</span>
                            <span className="text-xs text-lime-400 font-bold">{lastPerf.kg} kg × {lastPerf.reps}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Logged History</h2>
                {historyLogs.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 text-sm">
                    No workouts logged yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {historyLogs.map((log) => (
                      <div key={log.id} className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-white">{log.exerciseName}</p>
                          <p className="text-xs text-zinc-400">
                            {new Date(log.date).toLocaleDateString()} • Type: <span className="text-lime-400">{log.setType || 'N'}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lime-400 font-black text-base">{log.weight} kg</span>
                          <span className="text-zinc-400 text-xs ml-1">× {log.reps}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TOOLS TAB */}
            {activeTab === 'tools' && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Calculators</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2">
                    <Dumbbell className="w-6 h-6 text-lime-400" />
                    <div className="font-bold text-sm">Plate Loader</div>
                    <p className="text-[11px] text-zinc-400">Calculate bar weight per side</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2">
                    <Flame className="w-6 h-6 text-lime-400" />
                    <div className="font-bold text-sm">1RM Calculator</div>
                    <p className="text-[11px] text-zinc-400">Estimate max single rep</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL 1: ROUTINE BUILDER / EDITOR */}
      {showRoutineModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-40 p-4 max-w-md mx-auto flex flex-col justify-end">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 h-[85vh] flex flex-col space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-bold text-lg text-white">
                {editingRoutineId ? 'Edit Routine' : 'Create Routine'}
              </h2>
              <button onClick={() => setShowRoutineModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Routine Name (e.g. Legs & Abs)"
              value={newRoutineTitle}
              onChange={(e) => setNewRoutineTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-lime-400 font-bold"
            />

            <div className="flex-1 overflow-y-auto space-y-3">
              <span className="text-xs font-bold text-zinc-400 uppercase">Exercises ({routineExercises.length})</span>

              {routineExercises.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl p-4">
                  No exercises added yet. Tap below to pick movements.
                </div>
              ) : (
                routineExercises.map((ex, exIdx) => (
                  <div key={exIdx} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-lime-400 text-sm">{ex.name}</span>
                      <button 
                        onClick={() => {
                          const updated = [...routineExercises];
                          updated.splice(exIdx, 1);
                          setRoutineExercises(updated);
                        }}
                        className="text-zinc-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {ex.sets.map((s, setIdx) => (
                        <div key={setIdx} className="flex items-center justify-between bg-zinc-900 px-2 py-1 rounded-lg text-xs">
                          <span className="text-zinc-400 font-bold">Set {setIdx + 1}</span>
                          <button 
                            onClick={() => deleteRoutineSet(exIdx, setIdx)}
                            className="text-zinc-600 hover:text-red-400">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addSetToRoutineDraft(exIdx)}
                        className="text-[10px] text-lime-400 font-bold hover:underline pt-1">
                        + Add Set
                      </button>
                    </div>
                  </div>
                ))
              )}

              <button
                onClick={() => openExercisePicker('routine')}
                className="w-full py-3.5 bg-zinc-800/80 hover:bg-zinc-800 border border-dashed border-zinc-700 rounded-xl text-xs font-bold text-lime-400 flex items-center justify-center gap-1.5 transition-all">
                <Plus className="w-4 h-4" /> Add Exercise to Routine
              </button>
            </div>

            <button
              onClick={saveCustomRoutine}
              disabled={!newRoutineTitle.trim() || routineExercises.length === 0}
              className="w-full bg-lime-400 text-black py-3.5 rounded-xl font-black text-sm disabled:opacity-30 hover:bg-lime-300 transition-all">
              {editingRoutineId ? 'Update Routine' : 'Save Routine'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: EXERCISE SELECTOR MODAL */}
      {showExerciseModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 p-4 max-w-md mx-auto flex flex-col justify-end">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 h-[80vh] flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-white">Select Exercise</h2>
              <button onClick={() => setShowExerciseModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search name, machine, or muscle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredExercises.map((ex, i) => {
                const lastPerf = getLastPerformance(ex.name);
                return (
                  <div 
                    key={i} 
                    onClick={() => handleSelectExercise(ex.name)}
                    className="bg-zinc-800/40 border border-zinc-700/40 hover:border-lime-400 p-3 rounded-xl cursor-pointer flex justify-between items-center transition-all">
                    <div>
                      <p className="font-bold text-sm text-white">{ex.name}</p>
                      <p className="text-xs text-zinc-400">{ex.muscle} • <span className="text-lime-400/90">{ex.equipment}</span></p>
                      {lastPerf.kg && (
                        <p className="text-[10px] text-lime-400 font-bold mt-0.5">
                          Last: {lastPerf.kg} kg × {lastPerf.reps}
                        </p>
                      )}
                    </div>
                    <Plus className="w-4 h-4 text-lime-400" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      {!activeWorkout && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/95 border-t border-zinc-800 backdrop-blur-lg flex justify-around py-3 z-20">
          <button
            onClick={() => setActiveTab('workout')}
            className={`flex flex-col items-center gap-1 text-xs font-bold transition-all ${
              activeTab === 'workout' ? 'text-lime-400' : 'text-zinc-500'
            }`}>
            <Play className="w-5 h-5" />
            <span>Workout</span>
          </button>

          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex flex-col items-center gap-1 text-xs font-bold transition-all ${
              activeTab === 'exercises' ? 'text-lime-400' : 'text-zinc-500'
            }`}>
            <Dumbbell className="w-5 h-5" />
            <span>Exercises</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 text-xs font-bold transition-all ${
              activeTab === 'history' ? 'text-lime-400' : 'text-zinc-500'
            }`}>
            <Clock className="w-5 h-5" />
            <span>History</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex flex-col items-center gap-1 text-xs font-bold transition-all ${
              activeTab === 'tools' ? 'text-lime-400' : 'text-zinc-500'
            }`}>
            <BarChart2 className="w-5 h-5" />
            <span>Tools</span>
          </button>
        </nav>
        
      )}

      </>
      )}
  </div>

);
}