<script setup>
import { ref } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
    default: () => ({
      content: '',
      options: [],
      correctAnswer: null
    })
  }
})

const selectedAnswer = ref(null)
const emit = defineEmits(['answer'])

const submitAnswer = () => {
  emit('answer', {
    selected: selectedAnswer.value,
    correct: selectedAnswer.value === props.question.correctAnswer
  })
  selectedAnswer.value = null
}
</script>

<template>
  <div class="question-card">
    <div class="question-content">
      <h3>{{ question.content }}</h3>
    </div>
    
    <div class="options">
      <div
        v-for="(option, index) in question.options"
        :key="index"
        class="option"
        :class="{ selected: selectedAnswer === index }"
        @click="selectedAnswer = index"
      >
        {{ option }}
      </div>
    </div>

    <div class="actions">
      <button
        class="submit-btn"
        @click="submitAnswer"
        :disabled="selectedAnswer === null"
      >
        提交答案
      </button>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.question-content {
  margin-bottom: 20px;
}

.question-content h3 {
  margin: 0;
  color: #2c3e50;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.option {
  padding: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option:hover {
  background-color: #f8f9fa;
  border-color: #42b983;
}

.option.selected {
  background-color: #e1f3d8;
  border-color: #42b983;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.submit-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #3aa876;
}

.submit-btn:disabled {
  background-color: #a8a8a8;
  cursor: not-allowed;
}
</style>