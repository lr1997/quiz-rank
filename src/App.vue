<template>
  <div class="app">
    <nav>
      <router-link to="/">首页</router-link> |
      <router-link to="/quiz">答题</router-link>
    </nav>
    <div class="main-content">
      <router-view class="view-container"></router-view>
      <div class="leaderboard" v-if="showLeaderboard">
    <h2>排行榜</h2>
    <table>
      <thead>
        <tr>
          <th>排名</th>
          <th>学号</th>
          <th>姓名</th>
          <th>成绩</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(item, index) in rankings" 
          :key="index"
          :class="{ 'current-user': item.id === leaderboardStore.currentUser?.id }"
        >
          <td class="rank">
            <span :class="['rank-number', getRankClass(index + 1)]">
              {{ index + 1 }}
            </span>
          </td>
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td class="score">{{ item.score }}</td>
        </tr>
      </tbody>
    </table>
  </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLeaderboardStore } from './stores/leaderboard'


const route = useRoute()
const leaderboardStore = useLeaderboardStore()


const showLeaderboard = computed(() => {
  return route.path.includes('/quiz')
})

const rankings = computed(() => leaderboardStore.rankings)


const getRankClass = (rank) => {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return ''
}
</script>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

nav {
  padding: 20px 0;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #2c3e50;
}

nav a.router-link-active {
  color: #42b983;
}

.main-content {
  display: flex;
  gap: 20px;
  min-height: calc(100vh - 120px);
}

.view-container {
  flex: 1;
  min-width: 0;
}

.leaderboard {
  width: 300px;
  background-color: #e3f2fd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

.leaderboard h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.leaderboard table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 4px;
  overflow: hidden;
}

.leaderboard th,
.leaderboard td {
  padding: 10px;
  text-align: center;
  font-size: 0.9em;
}

.leaderboard th {
  background: #4a90e2;
  color: white;
  font-weight: 500;
}

.leaderboard tr:nth-child(even) {
  background: #f8f9fa;
}

.leaderboard tr:hover {
  background: #f1f4f6;
}

.rank {
  width: 40px;
}

.rank-number {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
}

.gold {
  background: #ffd700;
  color: #845703;
}

.silver {
  background: #c0c0c0;
  color: #666;
}

.bronze {
  background: #cd7f32;
  color: white;
}

.score {
  font-weight: bold;
  color: #e74c3c;
}

/* 滚动条样式 */
.leaderboard::-webkit-scrollbar {
  width: 6px;
}

.leaderboard::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.leaderboard::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.leaderboard::-webkit-scrollbar-thumb:hover {
  background: #555;
}
/* 添加当前用户高亮样式 */
.leaderboard tr.current-user {
  background-color: #fff3e0 !important; /* 浅橙色背景 */
  font-weight: 500;
  position: relative;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .leaderboard {
    width: 100%;
    max-height: none;
  }
}
</style>