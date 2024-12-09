<script setup>
import { useQuizStore } from '../../stores/quiz'
import { useLeaderboardStore } from '../../stores/leaderboard' // 添加这行
import QuestionCard from './QuestionCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const quizStore = useQuizStore()
const leaderboardStore = useLeaderboardStore() // 添加这行

if (!quizStore.startTime) {
    quizStore.startQuiz()
}

// 添加更新排行榜的方法
const updateLeaderboard = () => {
  leaderboardStore.updateCurrentUserScore(quizStore.score)
}

const handleAnswer = (answer) => {
  if (answer.correct) {
    quizStore.updateScore(10)
  }
  
  quizStore.recordAnswer(
    quizStore.currentQuestionIndex,
    answer.selected,
    answer.correct
  )

  // 每答完一题就更新排行榜
  updateLeaderboard()
  
  setTimeout(() => {
    if (!quizStore.isLastQuestion) {
      quizStore.nextQuestion()
      // 检查下一题是否是视频
      checkNextIsVideo()
    } else {
      // 答题完成时再更新一次排行榜，确保最终分数被记录
      updateLeaderboard()
      router.push('/quiz/result')
    }
  }, 500)
}

const checkNextIsVideo = () => {
  const currentQuestion = quizStore.currentQuestion
  if (currentQuestion?.type === 'video') {
    // 跳转到视频页面
    router.push({
      name: 'VideoLearn',
      params: { 
        videoId: currentQuestion.videoId
      }
    })
  }
}
</script>


<template>
  <div class="quiz-container">
    <!-- 如果当前是视频标记，显示提示 -->
    <div v-if="quizStore.currentQuestion?.type === 'video'" class="video-prompt">
      <h2>{{ quizStore.currentQuestion.title }}</h2>
      <p>{{ quizStore.currentQuestion.description }}</p>
      <router-link :to="`/video/${quizStore.currentQuestion.videoId}`" class="video-link">
        开始学习
      </router-link>
    </div>
    
    <!-- 如果是普通题目，显示问题卡片 -->
    <template v-else>
      <div class="quiz-header">
      <!-- 修改进度显示逻辑 -->
      <div class="progress">
        题目 {{ quizStore.currentActualQuestionIndex }}/{{ quizStore.actualQuestionCount }}
      </div>
      <div class="score">
        得分：{{ quizStore.score }}
      </div>
    </div>

    <div class="progress-bar">
      <!-- 修改进度条计算逻辑 -->
      <div 
        class="progress-fill"
        :style="{ width: `${(quizStore.currentActualQuestionIndex / quizStore.actualQuestionCount) * 100}%` }"
      ></div>
    </div>

      <QuestionCard
        v-if="quizStore.currentQuestion"
        :question="quizStore.currentQuestion"
        @answer="handleAnswer"
      />
    </template>
  </div>
</template>

<style scoped>
.quiz-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.progress-bar {
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  margin-bottom: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #42b983;
  transition: width 0.3s ease;
}

.progress{
  font-size: 18px;
  color: #2c3e50;
}
.score {
  font-size: 32px;
  color: red;
}

.video-prompt {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.video-link {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.video-link:hover {
  background: #3aa876;
}
</style>