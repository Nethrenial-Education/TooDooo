<template>
  <v-container>
    <v-row no-gutters>
      <v-col class="col-9">
        <v-text-field
          v-model="newTask"
          label="Add Task ..."
          outlined
          dark
        ></v-text-field
      ></v-col>

      <v-col class="col-3 add-button">
        <v-btn
          class="mx-2 add-button"
          fab
          dark
          color="grey darken-2"
          @click="addTask"
        >
          <v-icon dark> mdi-plus </v-icon>
        </v-btn></v-col
      >
    </v-row>
    <v-row v-if="error">
      <v-card class="empty" dark>
        <h3>
          {{ error }}
        </h3>
      </v-card>
    </v-row>

    <v-row v-if="!isLoading && isLoggedIn && !error">
      <v-tabs v-model="tab" dark color="grey" background-color="#262626">
        <v-tabs-slider color="grey darken-3"></v-tabs-slider>

        <v-tab v-for="item in items" :key="item" dark>
          {{ item }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" color="grey" dark class="tab-container">
        <v-tab-item :key="items[0]">
          <v-card v-if="remainingTasks.length === 0" class="empty">
            <p>
              There aren't any remaining tasks you've to complete,
              <br />Please add some!
            </p>
          </v-card>
          <v-card v-else>
            <ul>
              <v-row
                v-for="(task, i) in remainingTasks"
                :id="task.id"
                :key="task.added"
                ><v-col class="col-12 col-sm-10" align-self="center">
                  <li>
                    <v-icon color="#8c8c8c">{{ i + 1 }}.</v-icon>
                    &nbsp;&nbsp;
                    {{ task.task }}
                  </li></v-col
                >

                <v-col class="col-6 col-sm-1 utl-btn" align-self="center">
                  <v-btn
                    class="mx-0"
                    dark
                    fab
                    color="grey darken-2"
                    width="30px"
                    height="30px"
                    @click.stop="deleteTask(task.id)"
                  >
                    <v-icon dark> mdi-minus </v-icon></v-btn
                  >
                </v-col>
                <v-col class="col-6 col-sm-1 utl-btn" align-self="center">
                  <v-btn
                    class="mx-0"
                    fab
                    dark
                    height="30px"
                    width="30px"
                    color="grey darken-2"
                    @click.stop="confirmTask(task)"
                  >
                    <v-icon dark> mdi-check </v-icon></v-btn
                  ></v-col
                >
              </v-row>
            </ul>
          </v-card>
        </v-tab-item>
        <v-tab-item :key="items[1]">
          <v-card v-if="completedTasks.length === 0" class="empty">
            <p>
              You haven't completed any existing tasks,please do your work ..
            </p>
          </v-card>
          <v-card v-else>
            <ul>
              <v-row
                v-for="(task, i) in completedTasks"
                :id="task.id"
                :key="task.completed"
                ><v-col class="col-12 col-sm-10" align-self="center">
                  <li>
                    <v-icon color="#8c8c8c">{{ i + 1 }}.</v-icon>
                    &nbsp;&nbsp;
                    {{ task.task }}
                  </li></v-col
                >

                <v-col class="col col-sm-2 utl-btn" align-self="center">
                  <v-btn
                    class="mx-0"
                    dark
                    fab
                    color="grey darken-2"
                    width="30px"
                    height="30px"
                    @click.stop="deleteTask(task.id)"
                  >
                    <v-icon dark> mdi-minus </v-icon></v-btn
                  >
                </v-col>
              </v-row>
            </ul>
          </v-card>
        </v-tab-item>
      </v-tabs-items></v-row
    >
    <v-row v-if="addError && !isLoggedIn && !isLoading">
      <v-card class="empty" dark>
        <h3>
          Please
          <v-btn dark @click="login"
            ><v-icon>mdi-login</v-icon>&nbsp;Login</v-btn
          >
          to add tasks!
        </h3>
      </v-card></v-row
    >
    <v-row v-if="!isLoggedIn && !isLoading && !addError">
      <v-card class="empty" dark>
        <h3>
          Please
          <v-btn dark @click="login"
            ><v-icon>mdi-login</v-icon>&nbsp;Login</v-btn
          >
          to View your tasks and add new ones.
        </h3>
      </v-card></v-row
    >
    <v-row v-if="isLoading">
      <v-card color="grey darken-4" dark class="empty">
        <v-progress-circular
          indeterminate
          color="grey darken-2"
        ></v-progress-circular>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { db } from '~/plugins/firebase'
export default {
  data() {
    return {
      tab: null,
      error: null,
      addError: null,
      items: ['Remaining Tasks', 'Completed Tasks'],
      newTask: '',
      isLoading: false,
    }
  },
  computed: {
    user() {
      return this.$store.getters.GET_USER.email
    },
    isLoggedIn() {
      return this.$store.getters.GET_USER
    },
    remainingTasks() {
      const tasks = []
      this.$store.getters.GET_DAILY_TASKS.forEach((task) => {
        if (!task.isCompleted) {
          tasks.push(task)
        }
      })
      return tasks
    },
    completedTasks() {
      const tasks = []
      this.$store.getters.GET_DAILY_TASKS.forEach((task) => {
        if (task.isCompleted) {
          tasks.push(task)
        }
      })
      return tasks
    },
  },
  watch: {
    isLoggedIn() {
      this.$store.dispatch('getUserDailyTasks')
    },
  },
  async created() {
    this.isLoading = true
    await this.$store.dispatch('getUserDailyTasks')
    this.isLoading = false
  },
  methods: {
    makeError(err) {
      this.error = err
      setTimeout(() => {
        this.error = null
      }, 1000)
    },
    async login() {
      try {
        await this.$store.dispatch('login')
        this.error = null
      } catch (error) {
        this.makeError(error)
      }
    },
    async addTask() {
      if (this.newTask.trim() === '') {
        this.error = 'Please enter something before submitting'
        setTimeout(() => {
          this.error = null
        }, 1000)

        this.newTask = ''
      } else {
        this.isLoading = true
        const time = new Date().getTime()
        try {
          const docRef = await db
            .collection(this.user)
            .doc('tasks')
            .collection('dailyTasks')
            .add({
              task: this.newTask,
              isCompleted: false,
              added: time,
            })
          // eslint-disable-next-line no-console
          this.$store.dispatch('addDailyTask', {
            task: this.newTask,
            isCompleted: false,
            added: time,
            id: docRef.id,
          })
          this.newTask = ''
        } catch (error) {
          this.addError = error.message
          this.isLoading = false
        }
        this.isLoading = false
      }
    },
    async deleteTask(id) {
      this.isLoading = true
      await db
        .collection(this.user)
        .doc('tasks')
        .collection('dailyTasks')
        .doc(id)
        .delete()
      this.$store.dispatch('deleteDailyTask', id)
      this.isLoading = false
    },
    async confirmTask(task) {
      const completedTime = new Date().getTime()
      this.isLoading = true
      await db
        .collection(this.user)
        .doc('tasks')
        .collection('dailyTasks')
        .doc(task.id)
        .set({
          task: task.task,
          added: task.added,
          completed: completedTime,
          isCompleted: true,
        })
      await this.$store.dispatch('getUserDailyTasks')
      this.$store.dispatch('completedDailyTask', {
        task: task.task,
        added: task.added,
        completed: completedTime,
        isCompleted: true,
      })
      this.isLoading = false
    },
  },
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  margin-top: 10px;
  padding: 0;
  width: 100%;
}

.tab-container {
  width: 100%;
}

li {
  padding: 10px;
  margin: 0 auto;
  margin-bottom: 5px;
  border: 1px solid rgb(140, 140, 140);
  width: 98%;
  color: #8c8c8c;
}
.add-button {
  text-align: center;
}
.utl-btn {
  text-align: center;
}
.empty {
  height: 75vh;
  text-align: center;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.empty p {
  font-size: 36px;
  color: #8c8c8c;
  width: 75vw;
}
.empty h3 {
  text-align: center;
  font-size: 36px;
  color: #8c8c8c;
}
</style>
