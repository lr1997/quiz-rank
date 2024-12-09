// src/stores/leaderboard.js
import { defineStore } from 'pinia'
import { leaderboardData } from '../data/leaderboardData'

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    rankings: [...leaderboardData],  // 从初始数据复制
    currentUser: null
  }),

  actions: {
    updateCurrentUserScore(score) {
      if (!this.currentUser) return

      // 查找当前用户是否已在排行榜中
      const existingIndex = this.rankings.findIndex(item => 
        item.id === this.currentUser.id
      )

      if (existingIndex !== -1) {
        // 更新现有记录
        this.rankings[existingIndex].score = score
      } else {
        // 添加新记录
        this.rankings.push({
          id: this.currentUser.id,
          name: this.currentUser.name,
          score: score
        })
      }

      // 按分数排序
      this.rankings.sort((a, b) => b.score - a.score)
    },

    setCurrentUser(user) {
      this.currentUser = user
    }
  }
})