import { defineStore } from "pinia";
import questionsData from "../data/questions.json";

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    questions: questionsData.questions,
    currentQuestionIndex: 0,
    score: 0,
    answerHistory: [], // 新增答题历史记录
    startTime: null,   // 开始时间
    questionStartTime: null, // 每题开始时间
    userInfo: {
      id: '',
      name: ''
    },
  }),

  getters: {
    currentQuestion: (state) => state.questions[state.currentQuestionIndex],
    totalQuestions: (state) => state.questions.length,
    isLastQuestion: (state) =>
      state.currentQuestionIndex === state.questions.length - 1,
    progress: (state) =>
      ((state.currentQuestionIndex + 1) / state.questions.length) * 100,
    totalTime: (state) => {
      if (!state.startTime) return 0;
      return state.answerHistory.reduce((sum, record) => sum + record.timeSpent, 0);
    },
    // 获取实际的题目数量（排除视频）
    actualQuestionCount: (state) => {
      return state.questions.filter(q => !q.type || q.type !== 'video').length;
    },
    
    // 获取当前实际的题目序号（排除视频）
    currentActualQuestionIndex: (state) => {
      return state.questions
        .slice(0, state.currentQuestionIndex + 1)
        .filter(q => !q.type || q.type !== 'video')
        .length;
    },
  },

  actions: {
    startQuiz() {
      // 初始化整体开始时间和第一题开始时间
      this.startTime = new Date();
      this.questionStartTime = new Date();
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.answerHistory = [];
    },

    nextQuestion() {
      // 在进入下一题时设置新的开始时间
      this.questionStartTime = new Date();
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    },

    updateScore(points) {
      this.score += points;
    },

    recordAnswer(questionIndex, selectedAnswer, isCorrect) {
      const endTime = new Date();
      const timeSpent = (endTime - this.questionStartTime) / 1000; // 转换为秒

      this.answerHistory.push({
        questionIndex,
        question: this.questions[questionIndex],
        selectedAnswer,
        isCorrect,
        timeSpent,
      });
    },

    resetQuiz() {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.answerHistory = [];
      this.startTime = null;
      this.questionStartTime = null;
    },

    setUserInfo(id, name) {
      this.userInfo.id = id;
      this.userInfo.name = name;
    },

    resetQuiz() {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.answerHistory = [];
      this.startTime = null;
      this.questionStartTime = null;
      // 不重置用户信息，除非特别需要
      // this.userInfo = { id: '', name: '' };
    },
  },
});