import { auth, db, google } from '~/plugins/firebase'

export const strict = false

export const state = () => ({
  user: null,
  token: null,
  dailyTasks: [],
  goals: [],
  error: null,
})

export const getters = {
  GET_USER(state) {
    return state.user
  },
  GET_TOKEN(state) {
    return state.token
  },
  GET_DAILY_TASKS(state) {
    return state.dailyTasks
  },
  GET_GOALS(state) {
    return state.goals
  },
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  ADD_DAILY_TASKS(state, tasks) {
    tasks.sort((a, b) => {
      if (a.added < b.added) {
        return 1
      } else if (a.added > b.added) {
        return -1
      } else {
        return 0
      }
    })

    state.dailyTasks = tasks
  },
  ADD_GOALS(state, userGoals) {
    userGoals.sort((a, b) => {
      if (a.added < b.added) {
        return 1
      } else if (a.added > b.added) {
        return -1
      } else {
        return 0
      }
    })

    state.goals = userGoals
  },
  ADD_GOAL(state, goal) {
    state.goals.push(goal)
    state.goals.sort((a, b) => {
      if (a.added < b.added) {
        return 1
      } else if (a.added > b.added) {
        return -1
      } else {
        return 0
      }
    })
  },
  DELETE_GOAL(state, id) {
    const newGoals = state.goals.filter((goal) => goal.id !== id)
    state.goals = newGoals
  },
  COMPLETE_GOAL(state, goal) {
    const completedIndex = state.goals.findIndex((item) => item.id === goal.id)
    state.goals[completedIndex] = goal
  },
  ADD_DAILY_TASK(state, task) {
    state.dailyTasks.push(task)
    state.dailyTasks.sort((a, b) => {
      if (a.added < b.added) {
        return 1
      } else if (a.added > b.added) {
        return -1
      } else {
        return 0
      }
    })
  },
  DELETE_DAILY_TASK(state, id) {
    const newTasks = state.dailyTasks.filter((task) => task.id !== id)
    state.dailyTasks = newTasks
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_RECORDS(state) {
    state.dailyTasks = []
  },
  COMPLETE_DAILY_TASK(state, task) {
    const completedIndex = state.dailyTasks.findIndex(
      (item) => item.id === task.id
    )
    state.dailyTasks[completedIndex] = task
  },
}

export const actions = {
  async logout({ commit }) {
    await auth.signOut()

    commit('SET_USER', null)
    commit('CLEAR_RECORDS')
  },
  async login({ commit }) {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await auth.signInWithPopup(google)
      commit('SET_USER', user.user)
      commit('SET_TOKEN', user.credential.accessToken)
    } catch (error) {
      throw error
    }
  },
  async getUserDailyTasks({ commit, state }) {
    const time = new Date().getTime()
    if (state.user) {
      const tasks = []
      try {
        const dailyTasks = await db
          .collection(state.user.email)
          .doc('tasks')
          .collection('dailyTasks')
          .get()

        dailyTasks.forEach((task) => {
          if (time - task.data().added < 1000 * 60 * 60 * 24) {
            tasks.push({ ...task.data(), id: task.id })
          } else {
            db.collection(state.user.email)
              .doc('tasks')
              .collection('dailyTasks')
              .doc(task.id)
              .delete()
          }
        })
        commit('ADD_DAILY_TASKS', tasks)
      } catch (error) {
        commit('SET_ERROR', error)
      }
    } else {
      commit('CLEAR_RECORDS')
    }
  },
  addDailyTask({ commit }, task) {
    commit('ADD_DAILY_TASK', task)
  },
  deleteDailyTask({ commit }, id) {
    commit('DELETE_DAILY_TASK', id)
  },
  completedDailyTask({ commit }, task) {
    commit('COMPLETE_DAILY_TASK', task)
  },
  async getGoals({ commit, state }) {
    if (state.user) {
      const userGoals = []
      try {
        const goals = await db
          .collection(state.user.email)
          .doc('goals')
          .collection('longTermGoals')
          .get()

        goals.forEach((goal) => {
          userGoals.push({ ...goal.data(), id: goal.id })
        })
        commit('ADD_GOALS', userGoals)
      } catch (error) {
        commit('SET_ERROR', error)
      }
    } else {
      commit('CLEAR_RECORDS')
    }
  },
  addGoal({ commit }, goal) {
    commit('ADD_GOAL', goal)
  },
  deleteGoal({ commit }, id) {
    commit('DELETE_GOAL', id)
  },
  completedGoal({ commit }, goal) {
    commit('COMPLETE_GOAL', goal)
  },
}
