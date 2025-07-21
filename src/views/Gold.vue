<template>
  <div class="gold-page">
    <div class="gold-container">
      <!-- 金价走势图 -->
      <div class="gold-chart-card">
        <div class="chart-header">
          <h2>{{ selectedGold.name || '金价' }}走势图</h2>
          <div class="chart-controls">
            <el-select
              v-model="selectedGoldId"
              placeholder="选择金价"
              @change="handleGoldChange"
            >
              <el-option
                v-for="item in goldList"
                :key="item.goldId"
                :label="item.name"
                :value="item.goldId"
              />
            </el-select>
            <el-select
              v-model="selectedDays"
              placeholder="选择时间范围"
              @change="handleDaysChange"
            >
              <el-option label="最近7天" :value="7" />
              <el-option label="最近14天" :value="14" />
              <el-option label="最近30天" :value="30" />
              <el-option label="最近60天" :value="60" />
              <el-option label="最近90天" :value="90" />
              <el-option label="最近180天" :value="180" />
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
        <el-table
          :data="goldList"
          stripe
          style="width: 100%"
          class="gold-price-table"
          :header-cell-style="{
            backgroundColor: 'hsl(222, 47%, 11%)',
            color: 'hsl(214, 32%, 91%)',
            fontWeight: '600',
            borderBottom: '1px solid hsl(215, 25%, 27%, 0.3)',
          }"
          :cell-style="{
            backgroundColor: 'hsl(224, 71%, 4%)',
            color: 'hsl(210, 40%, 98%)',
            borderBottom: '1px solid hsl(215, 25%, 27%, 0.2)',
          }"
          :row-style="{
            backgroundColor: 'hsl(224, 71%, 4%)',
            transition: 'all 0.2s ease',
          }"
          :row-class-name="'gold-table-row'"
        >
          <el-table-column prop="name" label="品牌" width="180" />
          <el-table-column prop="price" label="价格(元/克)" align="right">
            <template #default="scope">
              <span class="gold-price-value">{{
                typeof scope.row.price === 'number'
                  ? scope.row.price.toFixed(2)
                  : scope.row.price
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="与基准价差" align="right" width="120">
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
  return (
    goldList.value.find((item) => item.goldId === selectedGoldId.value) || {}
  );
});

// 基准金价（今日金价）
const baseGoldPrice = computed(() => {
  const baseGold = goldList.value.find((item) => item.goldId === 'jj');
  return baseGold ? Number(baseGold.price) : 0;
});

// 计算与基准价的差值
const calculatePriceDiff = (gold: GoldItem) => {
  if (!baseGoldPrice.value || !gold.price) return '0';

  const price =
    typeof gold.price === 'string' ? parseFloat(gold.price) : gold.price;
  const diff = price - baseGoldPrice.value;

  return diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2);
};

// 获取价格差异的样式类
const getPriceDiffClass = (gold: GoldItem) => {
  if (!baseGoldPrice.value || !gold.price) return '';

  const price =
    typeof gold.price === 'string' ? parseFloat(gold.price) : gold.price;
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
      //   ElMessage.warning('金价列表数据为空');
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
    chartElement: document.getElementById('goldChart'),
  });

  if (!chartRef.value || goldHistory.value.length === 0) {
    console.log(
      '无法渲染图表：',
      !chartRef.value ? 'chartRef不存在' : '历史数据为空',
    );
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
  const dataPoints = sortedData
    .map((item) => {
      // 确保日期格式正确
      let date = null;
      try {
        date = item.time ? new Date(item.time) : null;
      } catch (e) {
        console.error('日期解析错误:', item.time, e);
        return null;
      }

      // 确保价格格式正确
      const price =
        typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      if (isNaN(price)) {
        console.error('价格格式错误:', item.price);
        return null;
      }

      return {
        x: date,
        y: price,
        label: date ? `${date.getMonth() + 1}/${date.getDate()}` : '未知日期',
      };
    })
    .filter((item) => item !== null);

  // 如果没有有效数据点，则不渲染图表
  if (dataPoints.length === 0) {
    console.log('没有有效的数据点');
    return;
  }

  // 提取标签和数据
  const labels = dataPoints.map((item) => item.label);
  const prices = dataPoints.map((item) => item.y);

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
    // 计算渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.3)'); // 紫色渐变起点 (深色模式)
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0.05)'); // 紫色渐变终点 (深色模式)

    // 定义深色主题色
    const primaryColor = 'rgb(167, 139, 250)'; // 亮紫色 (深色模式)
    const secondaryColor = 'rgb(192, 132, 252)'; // 更亮的紫色 (深色模式)
    const textColor = 'rgb(241, 245, 249)'; // 浅色文本 (深色模式)
    const mutedTextColor = 'rgb(148, 163, 184)'; // 次要文本 (深色模式)
    const borderColor = 'rgba(71, 85, 105, 0.5)'; // 边框颜色 (深色模式)
    const gridColor = 'rgba(71, 85, 105, 0.3)'; // 网格线颜色 (深色模式)

    chart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `${selectedGold.value.name || '金价'}(元/克)`,
            data: prices,
            borderColor: primaryColor,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            spanGaps: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: primaryColor,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              color: textColor,
              font: {
                family:
                  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                size: 12,
                weight: '500',
              },
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: textColor,
            bodyColor: mutedTextColor,
            borderColor: borderColor,
            borderWidth: 1,
            padding: 12,
            cornerRadius: 6,
            boxPadding: 6,
            titleFont: {
              size: 13,
              weight: '600',
              family:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            bodyFont: {
              size: 12,
              family:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            displayColors: false,
            callbacks: {
              title: function (tooltipItems) {
                if (tooltipItems.length > 0) {
                  const index = tooltipItems[0].dataIndex;
                  const item = sortedData[index];
                  if (item && item.time) {
                    const date = new Date(item.time);
                    return `${date.getFullYear()}年${
                      date.getMonth() + 1
                    }月${date.getDate()}日`;
                  }
                }
                return '';
              },
              label: function (context) {
                return `${context.parsed.y.toFixed(2)} 元/克`;
              },
            },
          },
        },
        scales: {
          x: {
            type: 'category',
            border: {
              display: false,
            },
            grid: {
              display: true,
              drawBorder: false,
              drawOnChartArea: true,
              color: gridColor,
            },
            ticks: {
              color: mutedTextColor,
              font: {
                family:
                  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                size: 11,
                weight: '500',
              },
              padding: 8,
              maxRotation: 0,
            },
          },
          y: {
            beginAtZero: false,
            border: {
              display: false,
            },
            position: 'right',
            ticks: {
              callback: function (value) {
                return value + ' 元';
              },
              color: mutedTextColor,
              font: {
                family:
                  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                size: 11,
                weight: '500',
              },
              padding: 8,
              precision: 2,
            },
            grid: {
              display: true,
              drawBorder: false,
              drawOnChartArea: true,
              color: gridColor,
            },
          },
        },
      },
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
            historyLength: goldHistory.value.length,
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
  if (
    goldList.value.length > 0 &&
    !goldList.value.some((item) => item.goldId === selectedGoldId.value)
  ) {
    selectedGoldId.value = goldList.value[0].goldId;
  }
});
</script>

<style scoped>
.gold-page {
  padding: 24px;
  background-color: hsl(222, 47%, 11%); /* 深色背景 */
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Helvetica, Arial, sans-serif;
  color: hsl(210, 40%, 98%); /* 浅色文本 */
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
  background-color: hsl(224, 71%, 4%); /* 深色卡片背景 */
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border: 1px solid hsl(215, 25%, 27%, 0.3); /* 深色边框 */
  transition: all 0.2s ease;
}

.gold-chart-card:hover,
.gold-list-card:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.25);
  border-color: hsl(215, 25%, 27%, 0.5);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid hsl(215, 25%, 27%, 0.3); /* 深色边框 */
  padding-bottom: 16px;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.chart-container {
  height: 400px;
  width: 100%;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  background: hsl(224, 71%, 4%, 0.5); /* 深色图表背景 */
  margin-bottom: 20px;
  border: 1px solid hsl(215, 25%, 27%, 0.3); /* 深色边框 */
}

.chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 16px;
}

.chart-container canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
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
  font-size: 18px;
  font-weight: 600;
  color: hsl(210, 40%, 98%); /* 浅色文本 */
  letter-spacing: -0.025em;
}

.price-up {
  color: hsl(0, 84%, 60%);
  font-weight: 500;
}

.price-down {
  color: hsl(142, 71%, 45%);
  font-weight: 500;
}

.no-data-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: hsl(210, 40%, 98%);
  font-size: 14px;
  text-align: center;
  background-color: hsl(224, 71%, 4%);
  padding: 12px 20px;
  border-radius: 6px;
  border: 1px solid hsl(215, 25%, 27%, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* 表格样式优化 - 深色模式 */
:deep(.el-table) {
  border-radius: 6px;
  overflow: hidden;
  box-shadow: none;
  border: 1px solid hsl(215, 25%, 27%, 0.3);
  background-color: hsl(224, 71%, 4%);
  color: hsl(210, 40%, 98%);
}

:deep(.el-table th) {
  background-color: hsl(222, 47%, 11%);
  font-weight: 600;
  color: hsl(214, 32%, 91%);
  font-size: 13px;
  padding: 12px 16px;
  border-bottom: 1px solid hsl(215, 25%, 27%, 0.3);
}

:deep(.el-table td) {
  padding: 12px 16px;
  font-size: 14px;
  color: hsl(210, 40%, 98%);
  border-bottom: 1px solid hsl(215, 25%, 27%, 0.2);
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: hsla(222, 47%, 11%, 0.4);
}

:deep(.el-table__row:hover td) {
  background-color: hsla(250, 84%, 20%, 0.3) !important;
}

/* 修复表格边框和背景 */
:deep(.el-table__inner-wrapper::before),
:deep(.el-table__border-left-patch) {
  background-color: hsl(215, 25%, 27%, 0.3) !important;
}

:deep(.el-table__header-wrapper),
:deep(.el-table__body-wrapper),
:deep(.el-table__footer-wrapper) {
  background-color: transparent;
}

:deep(.el-table__empty-block) {
  background-color: hsl(224, 71%, 4%);
}

:deep(.el-table__empty-text) {
  color: hsl(214, 32%, 91%);
}

/* 金价表格特定样式 */
.gold-price-table {
  --el-table-border-color: hsl(215, 25%, 27%, 0.3);
  --el-table-header-bg-color: hsl(222, 47%, 11%);
  --el-table-bg-color: hsl(224, 71%, 4%);
  --el-table-tr-bg-color: hsl(224, 71%, 4%);
  --el-table-expanded-cell-bg-color: hsl(224, 71%, 4%);
}

:deep(.gold-price-table .el-table__header) {
  border-bottom: 2px solid hsl(250, 84%, 67%, 0.3);
}

:deep(.gold-price-table .el-table__row) {
  transition: all 0.2s ease;
}

:deep(.gold-price-table .el-table__row:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

:deep(.gold-price-table .gold-table-row:nth-child(odd) td) {
  background-color: hsla(222, 47%, 11%, 0.4);
}

:deep(.gold-price-table .gold-table-row:nth-child(even) td) {
  background-color: hsla(224, 71%, 4%, 1);
}

:deep(.gold-price-table .gold-table-row:hover td) {
  background-color: hsla(250, 84%, 20%, 0.3) !important;
}

.gold-price-value {
  font-weight: 600;
  font-size: 15px;
  color: hsl(250, 84%, 80%);
  font-variant-numeric: tabular-nums;
}

/* 深色模式下的表单控件样式 */
:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
  border: 1px solid hsl(215, 25%, 27%, 0.5);
  background-color: hsl(222, 47%, 11%);
  box-shadow: none !important;
  transition: all 0.2s ease;
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: hsl(250, 84%, 67%);
}

:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: hsl(250, 84%, 67%);
  box-shadow: 0 0 0 2px hsla(250, 84%, 67%, 0.2) !important;
}

/* 下拉菜单文本颜色 */
:deep(.el-input__inner) {
  color: hsl(210, 40%, 98%) !important;
}

/* 下拉菜单图标颜色 */
:deep(.el-select .el-input .el-select__caret) {
  color: hsl(214, 32%, 91%);
}

/* 下拉选项样式 */
:deep(.el-select-dropdown) {
  background-color: hsl(222, 47%, 11%);
  border: 1px solid hsl(215, 25%, 27%, 0.5);
}

:deep(.el-select-dropdown__item) {
  color: hsl(210, 40%, 98%);
}

:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
  background-color: hsla(250, 84%, 20%, 0.3);
}

:deep(.el-select-dropdown__item.selected) {
  color: hsl(250, 84%, 67%);
  font-weight: 600;
}

/* 按钮样式 */
:deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  height: 36px;
  padding: 0 16px;
}

:deep(.el-button--primary) {
  background-color: hsl(250, 84%, 67%);
  border-color: hsl(250, 84%, 67%);
}

:deep(.el-button--primary:hover) {
  background-color: hsl(250, 84%, 60%);
  border-color: hsl(250, 84%, 60%);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

:deep(.el-button--primary:active) {
  background-color: hsl(250, 84%, 55%);
  border-color: hsl(250, 84%, 55%);
}

/* 图标颜色 */
:deep(.el-button .el-icon) {
  color: hsl(210, 40%, 98%);
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

/* 深色模式下的骨架屏样式 */
:deep(.el-skeleton) {
  --el-skeleton-color: hsla(222, 47%, 15%, 1);
  --el-skeleton-to-color: hsla(222, 47%, 18%, 1);
}

/* 深色模式下的消息提示样式 */
:deep(.el-message) {
  background-color: hsl(222, 47%, 11%);
  border-color: hsl(215, 25%, 27%, 0.3);
}

:deep(.el-message--info) {
  --el-message-text-color: hsl(210, 40%, 98%);
  --el-message-bg-color: hsl(222, 47%, 11%);
}

:deep(.el-message--success) {
  --el-message-text-color: hsl(142, 71%, 45%);
}

:deep(.el-message--error) {
  --el-message-text-color: hsl(0, 84%, 60%);
}

:deep(.el-message--warning) {
  --el-message-text-color: hsl(48, 96%, 53%);
}
</style>
/* 金价表格高亮和动画效果 */ @keyframes priceGlow { 0% { text-shadow: 0 0 5px
hsla(250, 84%, 67%, 0); } 50% { text-shadow: 0 0 10px hsla(250, 84%, 67%, 0.5);
} 100% { text-shadow: 0 0 5px hsla(250, 84%, 67%, 0); } } .gold-price-value {
animation: priceGlow 3s infinite; transition: all 0.3s ease; }
:deep(.gold-price-table .el-table__row:hover .gold-price-value) { color:
hsl(250, 84%, 90%); text-shadow: 0 0 10px hsla(250, 84%, 67%, 0.7); } /*
表格行交互效果增强 */ :deep(.gold-price-table .el-table__row) { position:
relative; overflow: hidden; } :deep(.gold-price-table .el-table__row::after) {
content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 3px;
background-color: transparent; transition: all 0.3s ease; }
:deep(.gold-price-table .el-table__row:hover::after) { background-color:
hsl(250, 84%, 67%); } /* 表格容器增强 */ .gold-list-card { position: relative;
overflow: hidden; } .gold-list-card::before { content: ''; position: absolute;
top: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg,
hsl(250, 84%, 67%) 0%, hsl(250, 84%, 80%) 50%, hsl(250, 84%, 67%) 100%);
opacity: 0.7; }
