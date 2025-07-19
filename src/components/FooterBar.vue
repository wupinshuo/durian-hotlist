<template>
  <div class="footer-bar">
    <div class="footer-content">
      <div class="copyright">
        榴莲热榜 © {{ currentYear }} - 技术与资讯热榜聚合平台
        <!-- <a href="https://durio.cc" target="_blank" class="footer-link">首页</a> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer-bar {
  width: 100%;
  padding: 16px 0;
  text-align: center;
  margin-top: 40px;
  background-color: rgba(249, 250, 252, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(230, 235, 243, 0.6);
}

body[data-theme='dark'] .footer-bar {
  background-color: rgba(34, 39, 46, 0.8);
  border-top: 1px solid rgba(48, 54, 61, 0.8);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.copyright {
  font-size: 14px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  display: inline-block;
  position: relative;
}

.footer-link {
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
  margin-left: 16px;
  position: relative;
}

.footer-link:hover {
  color: var(--primary-color);
}

.footer-link:before {
  content: '|';
  position: absolute;
  left: -10px;
  color: var(--text-secondary);
  opacity: 0.5;
}

@media (max-width: 768px) {
  .footer-bar {
    padding: 12px 0;
    margin-top: 30px;
  }
  
  .footer-content {
    padding: 0 12px;
  }
  
  .copyright, .footer-link {
    font-size: 12px;
  }
  
  .footer-link {
    margin-left: 12px;
  }
  
  .footer-link:before {
    left: -8px;
  }
}
</style> 