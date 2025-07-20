<template>
  <div class="gold-page">
    <div class="gold-container">
      <!-- 金价走势图 -->
      <div class="gold-chart-card">
        <div class="chart-header">
          <h2>{{ selectedGold.name || '金价' }}走势图</h2>
          <div class="chart-controls">
            <el-select v-model="selectedGoldId" placeholder="选择金价" @change="handleGoldChange">
              <el-option 
                v-for="item in goldList" 
                :key="item.goldId" 
                :label="item.name" 
                :value="item.goldId" 
              />
            </el-select>
            <el-select v-model="selectedDays" placeholder="选择时间范围" @change="handleDaysChange">
              <el-option label="最近7天" :value="7" />
              <el-option label="最近14天" :value="14" />
              <el-option label="最近30天" :value="30" />
            </el-select>
            <el-button type="primary" @click="refreshData">
              <el-icon><Refresh /></el-icon> 刷新
            </el-button>
          </div>
        </div>
        <div class="chart-container">
          <el-skeleton v-if="loading" :rows="10" animated />
          <div v-else class="chart-wrapper">
            <canvas ref="chartRef" id="goldChart"></canvas>
            <div v-if="goldHistory.length === 0" class="no-data-message">
              暂无历史数据
            </div>
          </div>
        </div>
      </div>

      <!-- 金价列表 -->
      <div class="gold-list-card">
        <h2>今日金价</h2>
        <el-table :data="goldList" stripe style="width: 100%">
          <el-table-column prop="name" label="品牌" />
          <el-table-column prop="price" label="价格(元/克)">
            <template #default="scope">
              <span>{{ typeof scope.row.price === 'number' ? scope.row.price.toFixed(2) : scope.row.price }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="与基准价差">
            <template #default="scope">
              <span :class="getPriceDiffClass(scope.row)">
                {{ calculatePriceDiff(scope.row) }}
              </span>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { getGoldList, getGoldHistory } from '@/api/gold';
import { GoldItem } from '@/types/gold';
import { ElMessage } from 'element-plus';
import { Refresh } from '@element-plus/icons-vue';
import Chart from 'chart.js/auto';

// 状态定义
const goldList = ref<GoldItem[]>([]);
const goldHistory = ref<GoldItem[]>([]);
const loading = ref(true);
const chartRef = ref<HTMLCanvasElement | null>(null);
const chart = ref<Chart | null>(null);
const selectedGoldId = ref('jj'); // 默认选择今日金价
const selectedDays = ref(7); // 默认查询7天

// 获取选中的金价信息
const selectedGold = computed(() => {
  return goldList.value.find(item => item.goldId === selectedGoldId.value) || {};
});

// 基准金价（今日金价）
const baseGoldPrice = computed(() => {
  const baseGold = goldList.value.find(item => item.goldId === 'jj');
  return baseGold ? Number(baseGold.price) : 0;
});

// 计算与基准价的差值
const calculatePriceDiff = (gold: GoldItem) => {
  if (!baseGoldPrice.value || !gold.price) return '0';
  
  const price = typeof gold.price === 'string' ? parseFloat(gold.price) : gold.price;
  const diff = price - baseGoldPrice.value;
  
  return diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2);
};

// 获取价格差异的样式类
const getPriceDiffClass = (gold: GoldItem) => {
  if (!baseGoldPrice.value || !gold.price) return '';
  
  const price = typeof gold.price === 'string' ? parseFloat(gold.price) : gold.price;
  const diff = price - baseGoldPrice.value;
  
  return diff > 0 ? 'price-up' : diff < 0 ? 'price-down' : '';
};

// 加载金价列表数据
const loadGoldList = async () => {
  try {
    const data = await getGoldList();
    if (data.length > 0) {
      goldList.value = data;
    } else {
      ElMessage.warning('金价列表数据为空');
    }
  } catch (error) {
    console.error('加载金价列表失败:', error);
    ElMessage.error('加载金价列表失败');
  }
};

// 加载金价历史数据
const loadGoldHistory = async () => {
  loading.value = true;
  try {
    const data = await getGoldHistory(selectedGoldId.value, selectedDays.value);
    if (data.length > 0) {
      goldHistory.value = data;
      renderChart();
    } else {
      ElMessage.warning('金价历史数据为空');
    }
  } catch (error) {
    console.error('加载金价历史数据失败:', error);
    ElMessage.error('加载金价历史数据失败');
  } finally {
    loading.value = false;
  }
};

// 渲染图表
const renderChart = () => {
  console.log('尝试渲染图表', { 
    chartRefExists: !!chartRef.value, 
    historyLength: goldHistory.value.length,
    chartElement: document.getElementById('goldChart')
  });
  
  if (!chartRef.value || goldHistory.value.length === 0) {
    console.log('无法渲染图表：', !chartRef.value ? 'chartRef不存在' : '历史数据为空');
    return;
  }
  
  // 销毁旧图表
  if (chart.value) {
    chart.value.destroy();
    chart.value = null;
  }
  
  // 确保canvas尺寸正确
const container = chartRef.value.parentElement;
  if (container) {
    chartRef.value.width = container.clientWidth;
    chartRef.value.height = container.clientHeight;
  }
  
  // 准备数据
  const sortedData = [...goldHistory.value].sort((a, b) => {
    const timeA = a.time ? new Date(a.time).getTime() : 0;
    const timeB = b.time ? new Date(b.time).getTime() : 0;
    return timeA - timeB;
  });
  
  // 检查数据有效性
  if (sortedData.length === 0) {
    console.log('排序后数据为空');
    return;
  }
  
  // 打印数据进行调试
  console.log('金价历史数据:', sortedData);
  
  // 创建日期标签和价格数据
  const dataPoints = sortedData.map(item => {
    // 确保日期格式正确
    let date = null;
    try {
      date = item.time ? new Date(item.time) : null;
    } catch (e) {
      console.error('日期解析错误:', item.time, e);
      return null;
    }
    
    // 确保价格格式正确
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    if (isNaN(price)) {
      console.error('价格格式错误:', item.price);
      return null;
    }
    
    return {
      x: date,
      y: price,
      label: date ? `${date.getMonth() + 1}/${date.getDate()}` : '未知日期'
    };
  }).filter(item => item !== null);
  
  // 如果没有有效数据点，则不渲染图表
  if (dataPoints.length === 0) {
    console.log('没有有效的数据点');
    return;
  }
  
  // 提取标签和数据
  const labels = dataPoints.map(item => item.label);
  const prices = dataPoints.map(item => item.y);
  
  // 创建图表
  const ctx = chartRef.value.getContext('2d');
  if (!ctx) {
    console.error('无法获取canvas上下文');
    return;
  }
  
  // 确保canvas尺寸正确
  const chartContainer = chartRef.value.parentElement;
  if (chartContainer) {
    chartRef.value.width = chartContainer.clientWidth;
    chartRef.value.height = 400;
  }
  
  // 创建图表
  try {
    chart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${selectedGold.value.name || '金价'}(元/克)`,
          data: prices,
          borderColor: '#F7A35C',
          backgroundColor: 'rgba(247, 163, 92, 0.1)',
          fill: true,
          tension: 0.4,
          spanGaps: true,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: '#F7A35C',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: {
                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                size: 13
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#303133',
            bodyColor: '#606266',
            borderColor: '#ebeef5',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            boxPadding: 6,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              title: function(tooltipItems) {
                if (tooltipItems.length > 0) {
                  const index = tooltipItems[0].dataIndex;
                  const item = sortedData[index];
                  if (item && item.time) {
                    const date = new Date(item.time);
                    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                  }
                }
                return '';
              },
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y} 元`;
              }
            }
          }
        }
      },
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: '日期',
            color: '#909399',
            font: {
              size: 13,
              weight: 'normal'
            },
            padding: {top: 10, bottom: 0}
          },
          grid: {
            display: true,
            drawBorder: true,
            drawOnChartArea: true,
            color: 'rgba(235, 238, 245, 0.6)'
          },
          ticks: {
            color: '#909399',
            font: {
              size: 12
            },
            padding: 8
          }
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: '价格(元/克)',
            color: '#909399',
            font: {
              size: 13,
              weight: 'normal'
            },
            padding: {top: 0, bottom: 10}
          },
          ticks: {
            callback: function(value) {
              return value + ' 元';
            },
            color: '#909399',
            font: {
              size: 12
            },
            padding: 8
          },
          grid: {
            display: true,
            drawBorder: true,
            drawOnChartArea: true,
            color: 'rgba(235, 238, 245, 0.6)'
          }
        }
      }
    });
    console.log('图表渲染完成');
  } catch (error) {
    console.error('图表渲染失败:', error);
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    await loadGoldList();
    // 添加更长的延迟确保DOM已完全渲染
    setTimeout(async () => {
      await loadGoldHistory();
      // 再次延迟确保chartRef已经挂载
      setTimeout(() => {
        if (chartRef.value && goldHistory.value.length > 0) {
          renderChart();
        } else {
          console.warn('延迟后仍无法渲染图表:', { 
            chartRefExists: !!chartRef.value, 
            historyLength: goldHistory.value.length 
          });
        }
      }, 300);
    }, 200);
  } catch (error) {
    console.error('初始化加载失败:', error);
  }
});

// 处理金价变化
const handleGoldChange = (goldId: string) => {
  selectedGoldId.value = goldId;
  loading.value = true;
  try {
    // 添加延迟确保DOM和数据都已更新
    setTimeout(async () => {
      await loadGoldHistory();
      // 再次延迟确保chartRef已经挂载
      setTimeout(() => {
        if (chartRef.value && goldHistory.value.length > 0) {
          renderChart();
          console.log('金价切换后重新渲染图表');
        }
      }, 100);
    }, 50);
  } catch (error) {
    console.error('切换金价失败:', error);
    ElMessage.error('切换金价失败');
  }
};

// 处理天数变化
const handleDaysChange = (days: number) => {
  selectedDays.value = days;
  loading.value = true;
  try {
    // 添加延迟确保DOM和数据都已更新
    setTimeout(async () => {
      await loadGoldHistory();
      // 再次延迟确保chartRef已经挂载
      setTimeout(() => {
        if (chartRef.value && goldHistory.value.length > 0) {
          renderChart();
          console.log('天数切换后重新渲染图表');
        }
      }, 100);
    }, 50);
  } catch (error) {
    console.error('切换天数失败:', error);
    ElMessage.error('切换天数失败');
  }
};

// 刷新数据
const refreshData = async () => {
  ElMessage.info('正在刷新数据...');
  try {
    await Promise.all([loadGoldList(), loadGoldHistory()]);
    // 添加延迟确保DOM和数据都已更新
    setTimeout(() => {
      if (chartRef.value && goldHistory.value.length > 0) {
        renderChart();
        console.log('刷新后重新渲染图表');
      }
    }, 100);
    ElMessage.success('数据已更新');
  } catch (error) {
    console.error('刷新数据失败:', error);
    ElMessage.error('刷新数据失败');
  }
};

// 监听金价列表变化
watch(goldList, () => {
  // 如果列表中没有选中的金价，则默认选择第一个
  if (goldList.value.length > 0 && !goldList.value.some(item => item.goldId === selectedGoldId.value)) {
    selectedGoldId.value = goldList.value[0].goldId;
  }
});
</script>

<style scoped>
.gold-page {
  padding: 20px;
  background-color: #f9fafc;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.gold-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.gold-chart-card,
.gold-list-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.gold-chart-card:hover,
.gold-list-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f2f5;
  padding-bottom: 16px;
}

.chart-controls {
  display: flex;
  gap: 12px;
}

.chart-container {
  height: 400px;
  width: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(to bottom, #ffffff, #f9fafc);
  margin-bottom: 20px; /* 添加底部间距 */
}

.chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart-container canvas {
  width: 100% !important;
  height: 100% !important;
  display: block; /* 确保canvas正确显示 */
}

/* 响应式布局 */
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .chart-controls {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .chart-container {
    height: 350px; /* 增加移动设备上的高度 */
  }
  
  .gold-chart-card,
  .gold-list-card {
    padding: 16px;
  }
}
h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  letter-spacing: 0.5px;
}

.price-up {
  color: #F56C6C;
  font-weight: 500;
}

.price-down {
  color: #67C23A;
  font-weight: 500;
}

.no-data-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #909399;
  font-size: 16px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
}

:deep(.el-table th) {
  background-color: #f9fafc;
  font-weight: 600;
  color: #606266;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafbfc;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .chart-controls {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .chart-container {
    height: 300px;
  }
  
  .gold-chart-card,
  .gold-list-card {
    padding: 16px;
  }
}
</style>