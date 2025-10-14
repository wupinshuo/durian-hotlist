<template>
  <div class="gold-page">
    <div class="gold-container">
      <!-- 金价走势图 -->
      <!-- <div class="gold-chart-card">
        <div class="chart-header">
          <h2>金价走势图</h2>
        </div>
        <div class="chart-container-wrapper">
          <el-skeleton v-if="loading" :rows="10" animated />
          <div v-else class="chart-content">
            <canvas ref="chartRef" id="goldChart"></canvas>
            <div v-if="goldHistory.length === 0" class="no-data-message">
              暂无历史数据
            </div>
            <div class="chart-selectors">
              <select
                v-model="selectedGoldId"
                @change="handleGoldChange"
                class="chart-select"
              >
                <option
                  v-for="item in goldList"
                  :key="item.goldId"
                  :value="item.goldId"
                >
                  {{ item.name }}
                </option>
              </select>
              <select
                v-model="selectedDays"
                @change="handleDaysChange"
                class="chart-select"
              >
                <option :value="7">7天</option>
                <option :value="14">14天</option>
                <option :value="30">30天</option>
                <option :value="60">60天</option>
                <option :value="90">90天</option>
                <option :value="180">180天</option>
              </select>
            </div>
          </div>
        </div>
      </div> -->

      <!-- 今日金价详细走势图 -->
      <div class="gold-chart-card today-gold-card">
        <div class="chart-header">
          <h2>今日金价实时走势</h2>
          <div class="chart-controls">
            <select
              v-model="todaySelectedDays"
              @change="handleTodayDaysChange"
              class="time-select"
            >
              <option :value="1">1天</option>
              <option :value="2">2天</option>
              <option :value="3">3天</option>
              <option :value="5">5天</option>
              <option :value="7">7天</option>
            </select>
            <el-button
              type="primary"
              @click="refreshTodayGoldData"
              class="refresh-button"
            >
              <el-icon><Refresh /></el-icon> 刷新
            </el-button>
            <el-button
              type="primary"
              @click="showHistoryDialog"
              class="history-button"
            >
              查看更多历史
            </el-button>
          </div>
        </div>
        <div class="chart-container-wrapper">
          <el-skeleton v-if="todayLoading" :rows="10" animated />
          <div v-else class="chart-content">
            <canvas ref="todayChartRef" id="todayGoldChart"></canvas>
            <div v-if="todayGoldHistory.length === 0" class="no-data-message">
              暂无实时数据
            </div>
          </div>
        </div>
      </div>

      <!-- 历史记录对话框 -->
      <el-dialog
        v-model="historyDialogVisible"
        title="今日金价历史记录"
        width="90%"
        :close-on-click-modal="false"
        class="history-dialog"
      >
        <div class="history-dialog-header">
          <select
            v-model="historySelectedDays"
            @change="loadHistoryData"
            class="history-days-select"
          >
            <option :value="7">最近7天</option>
            <option :value="14">最近14天</option>
            <option :value="30">最近30天</option>
            <option :value="60">最近60天</option>
            <option :value="90">最近90天</option>
            <option :value="180">最近180天</option>
          </select>
        </div>
        <div class="history-content">
          <el-skeleton v-if="historyLoading" :rows="10" animated />
          <div v-else-if="historyData.length > 0" class="history-list">
            <div
              v-for="(item, index) in historyData"
              :key="index"
              class="history-item"
            >
              <div class="history-date">
                {{ formatHistoryDate(item.time) }}
              </div>
              <div class="history-price">
                <span class="price-label">金价:</span>
                <span class="price-value">{{ formatPrice(item.price) }}</span>
                <span class="price-unit">元/克</span>
              </div>
              <div
                v-if="index > 0"
                class="history-change"
                :class="getPriceChangeClass(item.price, historyData[index - 1].price)"
              >
                {{ getPriceChange(item.price, historyData[index - 1].price) }}
              </div>
            </div>
          </div>
          <div v-else class="no-history-data">暂无历史数据</div>
        </div>
      </el-dialog>

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
import { getGoldList, getGoldHistory, getTodayGoldHistory } from '@/api/gold';
import { GoldItem, TodayGoldItem } from '@/types/gold';
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

// 今日金价详细数据状态
const todayGoldHistory = ref<TodayGoldItem[]>([]);
const todayLoading = ref(true);
const todayChartRef = ref<HTMLCanvasElement | null>(null);
const todayChart = ref<Chart | null>(null);
const todaySelectedDays = ref(1); // 默认查询1天

// 历史记录对话框状态
const historyDialogVisible = ref(false);
const historyData = ref<GoldItem[]>([]);
const historyLoading = ref(false);
const historySelectedDays = ref(7); // 默认查询7天

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

// 加载今日金价详细历史数据
const loadTodayGoldHistory = async () => {
  todayLoading.value = true;
  try {
    const data = await getTodayGoldHistory(todaySelectedDays.value);
    if (data && data.list.length > 0) {
      todayGoldHistory.value = data.list;
      renderTodayChart();
    } else {
      // ElMessage.warning('今日金价详细数据为空');
      todayGoldHistory.value = [];
    }
  } catch (error) {
    console.error('加载今日金价详细数据失败:', error);
    ElMessage.error('加载今日金价详细数据失败');
  } finally {
    todayLoading.value = false;
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

    // 根据屏幕宽度动态调整图表高度
    const screenWidth = window.innerWidth;
    let chartHeight = 400; // 默认高度

    if (screenWidth <= 360) {
      chartHeight = 220;
    } else if (screenWidth <= 430) {
      chartHeight = 300;
    } else if (screenWidth <= 768) {
      chartHeight = 280;
    }

    // 检查是否为横屏模式
    if (window.innerWidth > window.innerHeight && screenWidth <= 932) {
      chartHeight = 240;
    }

    chartRef.value.height = chartHeight;
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

    // 检测是否为移动设备
    const isMobile = window.innerWidth <= 768;

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
            pointRadius: isMobile ? 2 : 3,
            pointHoverRadius: isMobile ? 4 : 6,
            pointBackgroundColor: primaryColor,
            pointBorderColor: '#fff',
            pointBorderWidth: isMobile ? 1 : 2,
            borderWidth: isMobile ? 1.5 : 2,
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

// 渲染今日金价详细图表
const renderTodayChart = () => {
  console.log('尝试渲染今日金价图表', {
    chartRefExists: !!todayChartRef.value,
    historyLength: todayGoldHistory.value.length,
  });

  if (!todayChartRef.value || todayGoldHistory.value.length === 0) {
    console.log(
      '无法渲染今日金价图表：',
      !todayChartRef.value ? 'chartRef不存在' : '历史数据为空',
    );
    return;
  }

  // 销毁旧图表
  if (todayChart.value) {
    todayChart.value.destroy();
    todayChart.value = null;
  }

  // 准备数据 - 按时间戳排序
  const sortedData = [...todayGoldHistory.value].sort(
    (a, b) => a.timestamp - b.timestamp,
  );

  console.log('今日金价历史数据:', sortedData);

  // 创建时间标签和价格数据
  const dataPoints = sortedData.map((item) => {
    const date = new Date(item.timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const label = `${hours}:${minutes}`;

    return {
      x: item.timestamp,
      y: item.price,
      label,
      fullDate: date,
    };
  });

  if (dataPoints.length === 0) {
    console.log('没有有效的数据点');
    return;
  }

  // 提取标签和数据
  const labels = dataPoints.map((item) => item.label);
  const prices = dataPoints.map((item) => item.y);

  // 创建图表
  const ctx = todayChartRef.value.getContext('2d');
  if (!ctx) {
    console.error('无法获取canvas上下文');
    return;
  }

  // 确保canvas尺寸正确
  const chartContainer = todayChartRef.value.parentElement;
  if (chartContainer) {
    todayChartRef.value.width = chartContainer.clientWidth;

    // 根据屏幕宽度动态调整图表高度
    const screenWidth = window.innerWidth;
    let chartHeight = 400;

    if (screenWidth <= 360) {
      chartHeight = 220;
    } else if (screenWidth <= 430) {
      chartHeight = 300;
    } else if (screenWidth <= 768) {
      chartHeight = 280;
    }

    if (window.innerWidth > window.innerHeight && screenWidth <= 932) {
      chartHeight = 240;
    }

    todayChartRef.value.height = chartHeight;
  }

  // 创建图表
  try {
    // 计算渐变背景 - 使用橙色渐变以区分
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.3)'); // 橙色渐变起点
    gradient.addColorStop(1, 'rgba(249, 115, 22, 0.05)'); // 橙色渐变终点

    // 定义深色主题色 - 使用橙色系
    const primaryColor = 'rgb(251, 146, 60)'; // 橙色
    const textColor = 'rgb(241, 245, 249)';
    const mutedTextColor = 'rgb(148, 163, 184)';
    const borderColor = 'rgba(71, 85, 105, 0.5)';
    const gridColor = 'rgba(71, 85, 105, 0.3)';

    const isMobile = window.innerWidth <= 768;

    todayChart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '今日金价(元/克)',
            data: prices,
            borderColor: primaryColor,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            spanGaps: true,
            pointRadius: isMobile ? 2 : 3,
            pointHoverRadius: isMobile ? 4 : 6,
            pointBackgroundColor: primaryColor,
            pointBorderColor: '#fff',
            pointBorderWidth: isMobile ? 1 : 2,
            borderWidth: isMobile ? 1.5 : 2,
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
                  const item = dataPoints[index];
                  if (item && item.fullDate) {
                    const date = item.fullDate;
                    return `${date.getFullYear()}年${
                      date.getMonth() + 1
                    }月${date.getDate()}日 ${item.label}`;
                  }
                }
                return '';
              },
              label: function (context) {
                return `${context.parsed.y.toFixed(1)} 元/克`;
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
              maxRotation: 45,
              autoSkip: true,
              maxTicksLimit: isMobile ? 6 : 12,
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
              precision: 1,
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
    console.log('今日金价图表渲染完成');
  } catch (error) {
    console.error('今日金价图表渲染失败:', error);
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    await loadGoldList();
    // 添加更长的延迟确保DOM已完全渲染
    setTimeout(async () => {
      await Promise.all([loadGoldHistory(), loadTodayGoldHistory()]);
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

        if (todayChartRef.value && todayGoldHistory.value.length > 0) {
          renderTodayChart();
        } else {
          console.warn('延迟后仍无法渲染今日金价图表:', {
            todayChartRefExists: !!todayChartRef.value,
            todayHistoryLength: todayGoldHistory.value.length,
          });
        }
      }, 300);
    }, 200);
  } catch (error) {
    console.error('初始化加载失败:', error);
  }
});

// 处理金价变化
const handleGoldChange = () => {
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
const handleDaysChange = () => {
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

// 处理今日金价天数变化
const handleTodayDaysChange = () => {
  todayLoading.value = true;
  try {
    setTimeout(async () => {
      await loadTodayGoldHistory();
      setTimeout(() => {
        if (todayChartRef.value && todayGoldHistory.value.length > 0) {
          renderTodayChart();
          console.log('今日金价天数切换后重新渲染图表');
        }
      }, 100);
    }, 50);
  } catch (error) {
    console.error('切换今日金价天数失败:', error);
    ElMessage.error('切换今日金价天数失败');
  }
};

// 刷新今日金价数据
const refreshTodayGoldData = async () => {
  ElMessage.info('正在刷新今日金价数据...');
  try {
    await loadTodayGoldHistory();
    setTimeout(() => {
      if (todayChartRef.value && todayGoldHistory.value.length > 0) {
        renderTodayChart();
        console.log('刷新后重新渲染今日金价图表');
      }
    }, 100);
    ElMessage.success('今日金价数据已更新');
  } catch (error) {
    console.error('刷新今日金价数据失败:', error);
    ElMessage.error('刷新今日金价数据失败');
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

// 显示历史记录对话框
const showHistoryDialog = () => {
  historyDialogVisible.value = true;
  loadHistoryData();
};

// 加载历史数据
const loadHistoryData = async () => {
  historyLoading.value = true;
  try {
    const data = await getGoldHistory('jj', historySelectedDays.value);
    if (data.length > 0) {
      // 按时间倒序排列（最新的在前）
      historyData.value = data.sort((a, b) => {
        const timeA = a.time ? new Date(a.time).getTime() : 0;
        const timeB = b.time ? new Date(b.time).getTime() : 0;
        return timeB - timeA;
      });
    } else {
      historyData.value = [];
      ElMessage.warning('暂无历史数据');
    }
  } catch (error) {
    console.error('加载历史数据失败:', error);
    ElMessage.error('加载历史数据失败');
    historyData.value = [];
  } finally {
    historyLoading.value = false;
  }
};

// 格式化历史日期
const formatHistoryDate = (time?: string) => {
  if (!time) return '未知日期';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][
    date.getDay()
  ];
  return `${year}年${month}月${day}日 ${weekDay}`;
};

// 格式化价格
const formatPrice = (price: string | number) => {
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  return priceNum.toFixed(2);
};

// 计算价格变化
const getPriceChange = (currentPrice: string | number, prevPrice: string | number) => {
  const current = typeof currentPrice === 'string' ? parseFloat(currentPrice) : currentPrice;
  const prev = typeof prevPrice === 'string' ? parseFloat(prevPrice) : prevPrice;
  const change = current - prev;
  const changePercent = ((change / prev) * 100).toFixed(2);

  if (change > 0) {
    return `↑ ${change.toFixed(2)} (+${changePercent}%)`;
  } else if (change < 0) {
    return `↓ ${Math.abs(change).toFixed(2)} (${changePercent}%)`;
  } else {
    return '- 0.00 (0.00%)';
  }
};

// 获取价格变化样式类
const getPriceChangeClass = (currentPrice: string | number, prevPrice: string | number) => {
  const current = typeof currentPrice === 'string' ? parseFloat(currentPrice) : currentPrice;
  const prev = typeof prevPrice === 'string' ? parseFloat(prevPrice) : prevPrice;
  const change = current - prev;

  if (change > 0) {
    return 'price-change-up';
  } else if (change < 0) {
    return 'price-change-down';
  } else {
    return 'price-change-neutral';
  }
};
</script>

<style scoped>
.gold-page {
  padding: clamp(10px, 3vw, 24px); /* 响应式内边距 */
  background-color: hsl(222, 47%, 11%); /* 深色背景 */
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Helvetica, Arial, sans-serif;
  color: hsl(210, 40%, 98%); /* 浅色文本 */
  -webkit-tap-highlight-color: transparent; /* 移除移动端点击高亮 */
}

.gold-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vw, 24px); /* 响应式间距 */
}

.gold-chart-card,
.gold-list-card {
  background-color: hsl(224, 71%, 4%); /* 深色卡片背景 */
  border-radius: 8px;
  padding: 20px;
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
  margin-bottom: 16px;
  border-bottom: 1px solid hsl(215, 25%, 27%, 0.3); /* 深色边框 */
  padding-bottom: 12px;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.select-container {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.select-label {
  color: hsl(210, 40%, 98%);
  font-size: 14px;
  font-weight: 500;
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
  .gold-page {
    padding: 12px;
  }

  .gold-container {
    gap: 16px;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
    padding-bottom: 10px;
  }

  .chart-controls {
    width: 100%;
    flex-wrap: wrap;
  }

  .chart-container {
    height: 280px; /* 调整移动设备上的高度 */
    margin-bottom: 12px;
  }

  .gold-chart-card,
  .gold-list-card {
    padding: 14px;
    border-radius: 6px;
  }

  h2 {
    font-size: 16px;
    margin: 0 0 12px 0;
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

/* 今日金价卡片特殊样式 - 橙色主题 */
.today-gold-card {
  border: 1px solid hsla(24, 95%, 53%, 0.2); /* 橙色边框 */
}

.today-gold-card:hover {
  border-color: hsla(24, 95%, 53%, 0.3);
  box-shadow: 0 6px 12px rgba(249, 115, 22, 0.15);
}

.today-gold-card .chart-header {
  border-bottom-color: hsla(24, 95%, 53%, 0.2);
}

.today-gold-card h2 {
  color: hsl(24, 95%, 70%); /* 橙色标题 */
}

/* 今日金价卡片按钮样式 - 橙色主题 */
.today-gold-card .refresh-button {
  background-color: hsl(24, 95%, 53%);
  border-color: hsl(24, 95%, 53%);
}

.today-gold-card .refresh-button:hover {
  background-color: hsl(24, 95%, 48%);
  border-color: hsl(24, 95%, 48%);
  box-shadow: 0 4px 8px rgba(249, 115, 22, 0.3);
}

.today-gold-card .refresh-button:active {
  background-color: hsl(24, 95%, 43%);
  border-color: hsl(24, 95%, 43%);
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
:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
  border: 1px solid hsl(215, 25%, 27%, 0.5);
  background-color: hsl(222, 47%, 11%);
  box-shadow: none !important;
  transition: all 0.2s ease;
  height: 32px;
  min-height: 32px;
  padding: 0 8px;
}

:deep(.el-select .el-input) {
  height: 32px;
  line-height: 32px;
}

:deep(.el-select .el-input__inner) {
  height: 32px !important;
  line-height: 32px !important;
  color: hsl(210, 40%, 98%) !important;
}

:deep(.el-select .el-select__selected-item) {
  color: hsl(210, 40%, 98%) !important;
  line-height: 32px !important;
}

:deep(.el-select .el-select__placeholder) {
  color: hsl(210, 40%, 80%) !important;
  line-height: 32px !important;
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
  line-height: 32px;
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
  height: 32px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

/* 图表容器包装器 */
.chart-container-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  background: hsl(224, 71%, 4%, 0.5);
  margin-bottom: 20px;
  border: 1px solid hsl(215, 25%, 27%, 0.3);
}

.chart-content {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 16px;
}

/* 图表右下角选择器容器 - 金价走势图(紫色主题) */
.chart-selectors {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;
  display: flex;
  gap: 8px;
}

/* 图表选择器样式 - 紫色主题 */
.chart-select {
  padding: 6px 28px 6px 12px;
  height: 32px;
  background-color: hsla(222, 47%, 11%, 0.95);
  border: 1px solid hsla(250, 84%, 67%, 0.3);
  border-radius: 6px;
  color: hsl(210, 40%, 98%);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a78bfa' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
}

.chart-select:hover {
  border-color: hsla(250, 84%, 67%, 0.6);
  background-color: hsla(222, 47%, 11%, 1);
}

.chart-select:focus {
  border-color: hsl(250, 84%, 67%);
  box-shadow: 0 0 0 2px hsla(250, 84%, 67%, 0.2);
}

.chart-select option {
  background-color: hsl(222, 47%, 11%);
  color: hsl(210, 40%, 98%);
  padding: 8px;
}

/* 图表右下角时间选择器 - 今日金价(橙色主题) */
.chart-time-selector {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;
}

.time-select {
  padding: 6px 28px 6px 12px;
  height: 32px;
  background-color: hsla(222, 47%, 11%, 0.95);
  border: 1px solid hsla(24, 95%, 53%, 0.3);
  border-radius: 6px;
  color: hsl(210, 40%, 98%);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fb923c' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
}

.time-select:hover {
  border-color: hsla(24, 95%, 53%, 0.6);
  background-color: hsla(222, 47%, 11%, 1);
}

.time-select:focus {
  border-color: hsl(24, 95%, 53%);
  box-shadow: 0 0 0 2px hsla(24, 95%, 53%, 0.2);
}

.time-select option {
  background-color: hsl(222, 47%, 11%);
  color: hsl(210, 40%, 98%);
  padding: 8px;
} .refresh-button { height:
32px; padding: 0 16px; background-color: hsl(250, 84%, 67%); border-color:
hsl(250, 84%, 67%); display: flex; align-items: center; justify-content: center;
gap: 6px; transition: all 0.2s ease; } .refresh-button:hover { background-color:
hsl(250, 84%, 60%); border-color: hsl(250, 84%, 60%); transform:
translateY(-1px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
.refresh-button:active { background-color: hsl(250, 84%, 55%); border-color:
hsl(250, 84%, 55%); transform: translateY(0); } :deep(.refresh-button .el-icon)
{ margin-right: 0; font-size: 16px; } /* 修复下拉框在深色模式下的样式问题 */
:deep(.el-popper.is-light) { background-color: hsl(224, 71%, 4%) !important;
border-color: hsl(215, 25%, 27%, 0.5) !important; } :deep(.el-popper.is-light
.el-popper__arrow::before) { background-color: hsl(224, 71%, 4%) !important;
border-color: hsl(215, 25%, 27%, 0.5) !important; } /*
确保控件在移动设备上的对齐 */ @media (max-width: 768px) { .chart-controls {
flex-wrap: wrap; gap: 8px; } .dark-select { width: 100%; height: 40px;
margin-bottom: 2px; } :deep(.dark-select .el-input__wrapper) { height: 40px; }
.refresh-button { width: 100%; height: 40px; margin-top: 4px; } } /*
针对iPhone等设备的特殊优化 */ @media (max-width: 430px) { .gold-page { padding:
10px; } .gold-container { gap: 12px; } .gold-chart-card, .gold-list-card {
padding: 12px; } .chart-header { margin-bottom: 10px; padding-bottom: 8px; }
.chart-container { height: 250px; } :deep(.el-table th), :deep(.el-table td) {
padding: 10px; font-size: 13px; } .gold-price-value { font-size: 14px; } }/*
针对iPhone 14 Pro Max等大屏手机的优化 */ @media (min-width: 390px) and
(max-width: 430px) { .chart-container { height: 300px; /*
为大屏手机提供更大的图表高度 */ } .dark-select { height: 44px; /* 增加触摸区域
*/ } :deep(.dark-select .el-input__wrapper) { height: 44px; padding: 0 14px; }
:deep(.dark-select .el-input__inner) { font-size: 15px; } .refresh-button {
height: 44px; font-size: 15px; } :deep(.refresh-button .el-icon) { font-size:
18px; } /* 优化表格在大屏手机上的显示 */ .gold-price-value { font-size: 16px; }
:deep(.el-table th) { font-size: 14px; } :deep(.el-table td) { font-size: 15px;
} } /* 针对横屏模式的优化 */ @media (orientation: landscape) and (max-width:
932px) { .gold-container { max-width: 100%; } .chart-header { flex-direction:
row; align-items: center; flex-wrap: wrap; } .chart-controls { display: flex;
flex-direction: row; width: auto; } .dark-select { width: 140px; }
.refresh-button { width: auto; margin-top: 0; } .chart-container { height:
240px; } } /* 针对超小屏幕设备的优化 */ @media (max-width: 360px) { .gold-page {
padding: 8px; } .gold-chart-card, .gold-list-card { padding: 10px;
border-radius: 6px; } h2 { font-size: 15px; margin-bottom: 10px; }
.chart-container { height: 220px; } :deep(.el-table th), :deep(.el-table td) {
padding: 8px; font-size: 12px; } .gold-price-value { font-size: 13px; } } /*
优化下拉菜单在移动端的体验 */ :deep(.dark-select-dropdown) { max-width: 90vw; }
:deep(.dark-select-dropdown .el-select-dropdown__item) { padding: 0 12px;
height: 44px; line-height: 44px; font-size: 15px; } /* 优化移动端的触摸体验 */
@media (hover: none) and (pointer: coarse) { :deep(.el-select-dropdown__item),
:deep(.el-button), :deep(.el-input__wrapper) { cursor: default; }
:deep(.dark-select-dropdown .el-select-dropdown__item) { height: 44px;
line-height: 44px; } }

/* 图表选择器移动端适配 */
@media (max-width: 768px) {
  .chart-container-wrapper {
    height: 280px;
  }

  .chart-selectors {
    bottom: 12px;
    right: 12px;
    gap: 6px;
    flex-wrap: wrap;
    max-width: calc(100% - 24px);
  }

  .chart-select {
    font-size: 12px;
    height: 28px;
    padding: 4px 24px 4px 10px;
  }

  .chart-time-selector {
    bottom: 12px;
    right: 12px;
  }

  .time-select {
    font-size: 12px;
    height: 28px;
    padding: 4px 24px 4px 10px;
  }
}

/* 横屏模式下的优化 */
@media (orientation: landscape) and (max-width: 932px) {
  .chart-header {
    flex-direction: row;
    align-items: center;
  }

  .chart-controls {
    width: auto;
    flex-wrap: nowrap;
  }

  .chart-container-wrapper {
    height: 240px;
  }

  .refresh-button {
    width: auto;
    margin-top: 0;
  }
}

/* 历史按钮样式 */
.history-button {
  height: 32px;
  padding: 0 16px;
  background-color: hsl(24, 95%, 53%);
  border-color: hsl(24, 95%, 53%);
}

.history-button:hover {
  background-color: hsl(24, 95%, 48%);
  border-color: hsl(24, 95%, 48%);
  box-shadow: 0 4px 8px rgba(249, 115, 22, 0.3);
}

.history-button:active {
  background-color: hsl(24, 95%, 43%);
  border-color: hsl(24, 95%, 43%);
}

/* 历史记录对话框样式 */
:deep(.history-dialog) {
  background-color: hsl(222, 47%, 11%);
  border-radius: 12px;
}

:deep(.history-dialog .el-dialog__header) {
  background-color: hsl(222, 47%, 11%);
  border-bottom: 1px solid hsl(215, 25%, 27%, 0.3);
  padding: 20px;
}

:deep(.history-dialog .el-dialog__title) {
  color: hsl(210, 40%, 98%);
  font-size: 18px;
  font-weight: 600;
}

:deep(.history-dialog .el-dialog__body) {
  background-color: hsl(222, 47%, 11%);
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

:deep(.history-dialog .el-dialog__close) {
  color: hsl(210, 40%, 98%);
}

:deep(.history-dialog .el-dialog__close:hover) {
  color: hsl(24, 95%, 53%);
}

.history-dialog-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.history-days-select {
  padding: 8px 32px 8px 12px;
  height: 36px;
  background-color: hsl(224, 71%, 4%);
  border: 1px solid hsla(24, 95%, 53%, 0.3);
  border-radius: 6px;
  color: hsl(210, 40%, 98%);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fb923c' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.history-days-select:hover {
  border-color: hsla(24, 95%, 53%, 0.6);
  background-color: hsl(224, 71%, 6%);
}

.history-days-select:focus {
  border-color: hsl(24, 95%, 53%);
  box-shadow: 0 0 0 2px hsla(24, 95%, 53%, 0.2);
}

.history-days-select option {
  background-color: hsl(222, 47%, 11%);
  color: hsl(210, 40%, 98%);
  padding: 8px;
}

.history-content {
  min-height: 200px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: hsl(224, 71%, 4%);
  border: 1px solid hsl(215, 25%, 27%, 0.3);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.history-item:hover {
  border-color: hsla(24, 95%, 53%, 0.3);
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.15);
  transform: translateY(-1px);
}

.history-date {
  flex: 1;
  color: hsl(210, 40%, 98%);
  font-size: 14px;
  font-weight: 500;
}

.history-price {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.price-label {
  color: hsl(214, 32%, 91%, 0.7);
  font-size: 13px;
}

.price-value {
  color: hsl(24, 95%, 70%);
  font-size: 18px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.price-unit {
  color: hsl(214, 32%, 91%, 0.7);
  font-size: 13px;
}

.history-change {
  flex: 1;
  text-align: right;
  font-size: 14px;
  font-weight: 500;
}

.price-change-up {
  color: hsl(0, 84%, 60%);
}

.price-change-down {
  color: hsl(142, 71%, 45%);
}

.price-change-neutral {
  color: hsl(214, 32%, 91%, 0.5);
}

.no-history-data {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: hsl(214, 32%, 91%, 0.5);
  font-size: 14px;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .chart-controls {
    flex-wrap: wrap;
    gap: 8px;
  }

  .history-button {
    width: 100%;
    margin-top: 4px;
  }

  :deep(.history-dialog) {
    width: 95% !important;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .history-date,
  .history-price,
  .history-change {
    width: 100%;
    justify-content: flex-start;
  }

  .history-change {
    text-align: left;
  }
}
