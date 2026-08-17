import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface Task {
  id: string
  family_id: string
  name: string
  icon: string
  reward_minutes: number
  min_age: number | null
  max_age: number | null
  created_at: string
}

interface TasksState {
  tasks: Task[]
  isLoading: boolean
  error: string | null

  fetchTasks: (familyId: string) => Promise<void>
  addTask: (familyId: string, data: Omit<Task, 'id' | 'family_id' | 'created_at'>) => Promise<Task>
  updateTask: (id: string, data: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const DEFAULT_TASK_ICONS = [
  '🧹', '🍽️', '🛁', '🛏️', '📚', '🐕', '🌱', '🧺',
  '🪣', '🧽', '♻️', '🪴', '🥦', '🧁', '⭐', '🎯',
  '🏃', '🎨', '🧩', '🎵', '🌟', '🦷', '👟', '🐠',
]

export const DEFAULT_TASKS = [
  { name: 'Hacer la cama', icon: '🛏️', reward_minutes: 10, min_age: 5, max_age: null },
  { name: 'Lavar los platos', icon: '🍽️', reward_minutes: 15, min_age: 7, max_age: null },
  { name: 'Ordenar habitación', icon: '🧹', reward_minutes: 20, min_age: 5, max_age: null },
  { name: 'Recoger juguetes', icon: '🧩', reward_minutes: 10, min_age: 3, max_age: 8 },
  { name: 'Leer 20 minutos', icon: '📚', reward_minutes: 20, min_age: 6, max_age: null },
  { name: 'Dar de comer al perro', icon: '🐕', reward_minutes: 10, min_age: 6, max_age: null },
  { name: 'Regar las plantas', icon: '🌱', reward_minutes: 10, min_age: 5, max_age: null },
  { name: 'Poner la mesa', icon: '🥄', reward_minutes: 10, min_age: 6, max_age: null },
  { name: 'Ducharse solo', icon: '🛁', reward_minutes: 15, min_age: 7, max_age: null },
  { name: 'Estudiar / Deberes', icon: '📝', reward_minutes: 30, min_age: 6, max_age: null },
]

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (familyId) => {
    set({ isLoading: true })
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: true })

    if (error) {
      set({ error: error.message, isLoading: false })
    } else {
      set({ tasks: data || [], isLoading: false })
    }
  },

  addTask: async (familyId, taskData) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...taskData, family_id: familyId })
      .select()
      .single()

    if (error) throw error
    set((state) => ({ tasks: [...state.tasks, data] }))
    return data
  },

  updateTask: async (id, updates) => {
    const { error } = await supabase.from('tasks').update(updates).eq('id', id)
    if (error) throw error
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))
  },

  deleteTask: async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
  },
}))
