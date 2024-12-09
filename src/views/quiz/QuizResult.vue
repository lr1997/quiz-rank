<script setup>
import { useQuizStore } from "../../stores/quiz";
import { useRouter } from "vue-router";
import { onMounted } from 'vue';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



const quizStore = useQuizStore();
const router = useRouter();

// 添加输出答题详情的方法
const outputResult = () => {
  const result = {
    userInfo: quizStore.userInfo,
    score: quizStore.score,
    totalTime: quizStore.totalTime,
    answers: quizStore.answerHistory.map(record => ({
      questionIndex: record.questionIndex,
      question: record.question.content,
      selectedAnswer: record.selectedAnswer,
      correctAnswer: record.question.correctAnswer,
      isCorrect: record.isCorrect,
      timeSpent: record.timeSpent
    }))
  };
  
  console.log('答题详情:', JSON.stringify(result, null, 2));
};

// 在组件挂载时输出
onMounted(() => {
  outputResult();
});

const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}秒`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(1);
  return `${minutes}分${remainingSeconds}秒`;
};

const restartQuiz = () => {
  quizStore.resetQuiz();
  router.push("/quiz");
};

const goHome = () => {
  router.push("/");
};

const exportToExcel = () => {
  // 准备数据
  const data = [
    // 表头
    ['学号', '姓名', '总分', '总用时(秒)', '题号', '是否正确', '用时(秒)'],
  ];

  // 添加答题记录
  quizStore.answerHistory.forEach((record, index) => {
    data.push([
      quizStore.userInfo.id,
      quizStore.userInfo.name,
      quizStore.score,
      quizStore.totalTime.toFixed(1),
      index + 1,
      record.isCorrect ? '正确' : '错误',
      record.timeSpent.toFixed(1)
    ]);
  });

  // 创建工作簿和工作表
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);

  // 设置列宽
  const colWidth = [
    { wch: 15 }, // 学号
    { wch: 10 }, // 姓名
    { wch: 8 },  // 总分
    { wch: 12 }, // 总用时
    { wch: 8 },  // 题号
    { wch: 10 }, // 是否正确
    { wch: 10 }, // 用时
  ];
  ws['!cols'] = colWidth;

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, "答题记录");

  // 生成文件并下载
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // 使用当前时间生成文件名
  const fileName = `答题记录_${quizStore.userInfo.id}_${new Date().toISOString().split('T')[0]}.xlsx`;
  saveAs(blob, fileName);
};
</script>

<template>
  <div class="quiz-result">
    <div class="result-card">
      <h2>答题完成！</h2>
      
      <div class="score-section">
        <div class="score-title">您的得分</div>
        <div class="score-number">{{ quizStore.score }}</div>
        <div class="total-score">满分：{{ quizStore.totalQuestions * 10 }}</div>
        <div class="time-info">
          <div>总用时：{{ formatTime(quizStore.totalTime) }}</div>
          <div>平均用时：{{ formatTime(quizStore.totalTime / quizStore.totalQuestions) }}</div>
        </div>
      </div>

      <div class="answer-details">
        <h3>答题详情</h3>
        <div 
          v-for="(record, index) in quizStore.answerHistory" 
          :key="index"
          class="question-record"
          :class="{ correct: record.isCorrect }"
        >
          <div class="question-header">
            <div class="question-number">第 {{ index + 1 }} 题</div>
            <div class="question-time">用时：{{ formatTime(record.timeSpent) }}</div>
          </div>
          <div class="question-content">{{ record.question.content }}</div>
          <div class="answer-info">
            <div>
              您的答案：{{ record.question.options[record.selectedAnswer] }}
              <span class="status-icon">
                {{ record.isCorrect ? '✓' : '✗' }}
              </span>
            </div>
            <div v-if="!record.isCorrect" class="correct-answer">
              正确答案：{{ record.question.options[record.question.correctAnswer] }}
            </div>
          </div>
        </div>
      </div>

      <div class="answer-table">
      <h2>答题详情</h2>
      <table>
        <thead>
          <tr>
            <th>题号</th>
            <th>结果</th>
            <th>用时(秒)</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(record, index) in quizStore.answerHistory" 
            :key="index"
            :class="{ 'correct': record.isCorrect, 'incorrect': !record.isCorrect }"
          >
            <td>{{ index + 1 }}</td>
            <td>
              <span :class="record.isCorrect ? 'status-correct' : 'status-incorrect'">
                {{ record.isCorrect ? '✓' : '✗' }}
              </span>
            </td>
            <td>{{ record.timeSpent.toFixed(1) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

      <div class="actions">
        <button class="restart-btn" @click="restartQuiz">重新答题</button>
        <button class="home-btn" @click="goHome">返回首页</button>
        <button class="export-btn" @click="exportToExcel">导出Excel</button>
      </div>
    </div>
  </div>

  <div class="answer-table">
    
    
  </div>
</template>

<style scoped>
.quiz-result {
  padding: 20px;
}

.result-card {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.score-section {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.score-title {
  font-size: 1.2em;
  color: #666;
  margin-bottom: 10px;
}

.score-number {
  font-size: 3em;
  font-weight: bold;
  color: #42b983;
  margin-bottom: 5px;
}

.total-score {
  color: #666;
}

.time-info {
  margin-top: 15px;
  font-size: 0.9em;
  color: #666;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.answer-details {
  margin-top: 30px;
}

.answer-details h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.question-record {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid #dc3545;
}

.question-record.correct {
  border-left-color: #42b983;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.question-number {
  font-weight: bold;
  color: #2c3e50;
}

.question-time {
  font-size: 0.9em;
  color: #666;
}

.question-content {
  color: #2c3e50;
  margin-bottom: 10px;
}

.answer-info {
  font-size: 0.95em;
  color: #666;
}

.status-icon {
  margin-left: 8px;
  font-weight: bold;
}

.correct .status-icon {
  color: #42b983;
}

.question-record:not(.correct) .status-icon {
  color: #dc3545;
}

.correct-answer {
  margin-top: 5px;
  color: #42b983;
  font-weight: 500;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.restart-btn,
.home-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s;
}

.restart-btn {
  background: #42b983;
  color: white;
}

.restart-btn:hover {
  background: #3aa876;
}

.home-btn {
  background: #f8f9fa;
  color: #666;
}

.home-btn:hover {
  background: #e9ecef;
}

@media (max-width: 600px) {
  .quiz-result {
    padding: 10px;
  }

  .result-card {
    padding: 20px;
  }

  .time-info {
    flex-direction: column;
    gap: 10px;
  }

  .actions {
    flex-direction: column;
  }

  .restart-btn,
  .home-btn {
    width: 100%;
  }
}

.export-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  background: #007bff;
  color: white;
  transition: background-color 0.2s;
}

.export-btn:hover {
  background: #0056b3;
}
</style>