<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from '../stores/quiz';  // 确保路径正确
import { useLeaderboardStore } from '../stores/leaderboard';


const router = useRouter();
const quizStore = useQuizStore();  // 这行很重要，不能漏掉
const leaderboardStore = useLeaderboardStore();


const userInfo = ref({
  id: "20230155",
  name: "刘瑞",
});

const startQuiz = () => {
  if (!userInfo.value.id || !userInfo.value.name) {
    alert("请填写完整信息");
    return;
  }
  
  leaderboardStore.setCurrentUser({
    id: userInfo.value.id,
    name: userInfo.value.name
  });
  
  router.push('/quiz');
};
</script>

<template>
  <div class="home">
    <h1>QuizRank</h1>
    
    <div class="user-form">
      <div class="form-item">
        <input 
          type="text" 
          v-model="userInfo.id" 
          placeholder="请输入学号"
          class="input-field"
        >
      </div>
      <div class="form-item">
        <input 
          type="text" 
          v-model="userInfo.name" 
          placeholder="请输入姓名"
          class="input-field"
        >
      </div>
    </div>

    <div class="actions">
      <!-- 改用 button 而不是 router-link -->
      <button class="start-btn" @click="startQuiz">开始答题</button>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  padding: 40px 0;
}

.user-form {
  max-width: 300px;
  margin: 30px auto;
}

.form-item {
  margin: 15px 0;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.actions {
  margin-top: 30px;
}

.start-btn {
  display: inline-block;
  padding: 12px 24px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.start-btn:hover {
  background-color: #3aa876;
}
</style>