<template>
  <v-container>
    <v-row v-if="!readyToAdd">
      <v-col class="col">
        <v-btn @click="makeReadyToAdd"> Add new goal </v-btn>
      </v-col></v-row
    >
    <v-row v-if="readyToAdd" no-gutters>
      <v-col class="col">
        <v-text-field
          v-model="newGoal"
          label="New goal ..."
          outlined
          dark
        ></v-text-field
      ></v-col>
    </v-row>
    <v-row v-if="readyToAdd" no-gutters>
      <v-col class="col">
        <v-textarea
          v-model="newGoalDescription"
          label="New goal description ..."
          outlined
          dark
        ></v-textarea
      ></v-col>
    </v-row>
    <v-row v-if="readyToAdd" no-gutters>
      <v-col class="col-6 add-button">
        <v-btn
          class="mx-2 add-button"
          fab
          dark
          color="grey darken-2"
          @click="addGoal"
        >
          <v-icon dark> mdi-plus </v-icon>
        </v-btn></v-col
      >
      <v-col class="col-6 add-button">
        <v-btn
          class="mx-2 add-button"
          fab
          dark
          color="grey darken-2"
          @click="makeReadyToAdd"
        >
          <v-icon dark>mdi-window-close</v-icon>
        </v-btn></v-col
      ></v-row
    >

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
          <v-card
            v-if="remainingGoals.length === 0 && completedGoals.length === 0"
            class="empty"
          >
            <p>
              You haven't added any goals yet.
              <br />Please add some!
            </p>
          </v-card>
          <v-card
            v-else-if="
              remainingGoals.length === 0 && completedGoals.length !== 0
            "
            class="empty"
          >
            <p>You have achieved all your goals, Bravo!</p></v-card
          >
          <v-card v-else>
            <ul>
              <v-row
                v-for="(goal, i) in remainingGoals"
                :id="goal.id"
                :key="goal.added"
                ><v-col class="col-12 col-sm-10" align-self="center">
                  <li>
                    <v-icon color="#8c8c8c">{{ i + 1 }}.</v-icon>
                    &nbsp;&nbsp;
                    <h3>{{ goal.goal }}</h3>
                    <p>{{ goal.description }}</p>
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
                    @click.stop="deleteGoal(goal.id)"
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
                    @click.stop="confirmGoal(goal)"
                  >
                    <v-icon dark> mdi-check </v-icon></v-btn
                  ></v-col
                >
              </v-row>
            </ul>
          </v-card>
        </v-tab-item>
        <v-tab-item :key="items[1]">
          <v-card v-if="completedGoals.length === 0" class="empty">
            <p>You haven't completed any goals yet,please get to work ..</p>
          </v-card>
          <v-card v-else>
            <ul>
              <v-row
                v-for="(goal, i) in completedGoals"
                :id="goal.id"
                :key="goal.completed"
                ><v-col class="col-12 col-sm-10" align-self="center">
                  <li>
                    <v-icon color="#8c8c8c">{{ i + 1 }}.</v-icon>
                    &nbsp;&nbsp;
                    <h3>{{ goal.goal }}</h3>
                    <p>{{ goal.description }}</p>
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
                    @click.stop="deleteGoal(goal.id)"
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
          to add goals!
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
          to View your goals and add new ones.
        </h3>
      </v-card></v-row
    >
    <v-row v-if="isLoading">
      <v-card color="grey darken-4" dark class="empty">
        <v-card-text>
          <v-progress-circular
            indeterminate
            color="grey darken-2"
          ></v-progress-circular>
        </v-card-text>
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
      items: ['My Long Term Goals', 'Achieved Goals'],
      newGoal: '',
      newGoalDescription: '',
      isLoading: false,
      readyToAdd: false,
    }
  },
  computed: {
    user() {
      return this.$store.getters.GET_USER.email
    },
    isLoggedIn() {
      return this.$store.getters.GET_USER
    },
    remainingGoals() {
      const goals = []
      this.$store.getters.GET_GOALS.forEach((goal) => {
        if (!goal.isCompleted) {
          goals.push(goal)
        }
      })
      return goals
    },
    completedGoals() {
      const goals = []
      this.$store.getters.GET_GOALS.forEach((goal) => {
        if (goal.isCompleted) {
          goals.push(goal)
        }
      })
      return goals
    },
  },
  watch: {
    isLoggedIn() {
      this.$store.dispatch('getGoals')
    },
  },
  async created() {
    this.isLoading = true
    await this.$store.dispatch('getGoals')
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
    async addGoal() {
      if (this.newGoal.trim() === '' || this.newGoalDescription.trim() === '') {
        this.error = 'Please enter something before submitting'
        setTimeout(() => {
          this.error = null
        }, 1000)

        this.newGoal = ''
        this.newGoalDescription = ''
      } else {
        this.isLoading = true
        const time = new Date().getTime()
        try {
          const docRef = await db
            .collection(this.user)
            .doc('goals')
            .collection('longTermGoals')
            .add({
              goal: this.newGoal,
              description: this.newGoalDescription,
              isCompleted: false,
              added: time,
            })
          // eslint-disable-next-line no-console
          this.$store.dispatch('addGoal', {
            goal: this.newGoal,
            description: this.newGoalDescription,
            isCompleted: false,
            added: time,
            id: docRef.id,
          })
          this.newGoal = ''
          this.newGoalDescription = ''
          this.makeReadyToAdd()
        } catch (error) {
          this.addError = error.message
          this.isLoading = false
        }
        this.isLoading = false
      }
    },
    async deleteGoal(id) {
      this.isLoading = true
      await db
        .collection(this.user)
        .doc('goals')
        .collection('longTermGoals')
        .doc(id)
        .delete()
      this.$store.dispatch('deleteGoal', id)
      this.isLoading = false
    },
    async confirmGoal(goal) {
      const completedTime = new Date().getTime()
      this.isLoading = true
      await db
        .collection(this.user)
        .doc('goals')
        .collection('longTermGoals')
        .doc(goal.id)
        .set({
          goal: goal.goal,
          description: goal.description,
          added: goal.added,
          completed: completedTime,
          isCompleted: true,
        })
      await this.$store.dispatch('getGoals')
      this.$store.dispatch('completedGoal', {
        goal: goal.goal,
        description: goal.description,
        added: goal.added,
        completed: completedTime,
        isCompleted: true,
      })
      this.isLoading = false
    },
    makeReadyToAdd() {
      this.readyToAdd = !this.readyToAdd
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
