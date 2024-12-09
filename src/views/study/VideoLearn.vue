<script setup>
import { useRouter } from 'vue-router'
import { useQuizStore } from '../../stores/quiz'

const router = useRouter()
const quizStore = useQuizStore()

const completeVideo = () => {
  quizStore.nextQuestion()
  router.push('/quiz')
}
</script>

<template>
  <div class="video-learn">
    <div class="video-card">
      <div class="video-header">
        <h2>学习视频</h2>
        <div class="progress">
          第 {{ quizStore.currentQuestionIndex + 1 }}/{{ quizStore.totalQuestions }} 部分
        </div>
      </div>

      <div class="video-player-container">
        <!-- 视频播放器占位 -->
        <div class="video-placeholder">
          视频播放区域
        </div>
      </div>

      <div class="video-info">
        <div class="video-title">
          {{ quizStore.currentQuestion?.title || '视频标题' }}
        </div>
        <div class="video-description">
          {{ quizStore.currentQuestion?.description || '视频描述' }}
        </div>
      </div>

      <div class="actions">
        <button class="continue-btn" @click="completeVideo">
          继续答题
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-learn {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.video-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.video-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5em;
}

.progress {
  color: #666;
  font-size: 0.9em;
  padding: 6px 12px;
  background: #f8f9fa;
  border-radius: 4px;
}

.video-player-container {
  width: 100%;
  background: #f8f9fa;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 20px;
}

.video-placeholder {
  width: 100%;
  padding-top: 56.25%; /* 16:9 比例 */
  position: relative;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.video-info {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 20px;
}

.video-title {
  font-size: 1.2em;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
}

.video-description {
  color: #666;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.continue-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.continue-btn:hover {
  background-color: #3aa876;
}

@media (max-width: 600px) {
  .video-learn {
    padding: 10px;
  }

  .video-card {
    padding: 15px;
  }

  .video-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .video-info {
    padding: 15px;
  }
}
</style>