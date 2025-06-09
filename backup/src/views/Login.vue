<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>登录</h2>
      <el-form>
        <el-form-item label="用户名">
          <el-input />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 登录逻辑后续补充
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.login-card {
  width: 350px;
}
</style> 