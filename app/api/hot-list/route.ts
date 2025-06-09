import { NextRequest, NextResponse } from 'next/server';
import { ReturnData } from '@/types/base';
import { GithubHostList, HotList, HotType, GithubPeriod } from '@/types/hot';
import axios from 'axios';

// 外部API的基础URL
const API_BASE_URL = 'http://localhost:8082/api/v1/api-data/hot-list';

// 设置CORS响应头
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );
  return response;
}

// OPTIONS 请求处理CORS预检
export async function OPTIONS(request: NextRequest) {
  const response = NextResponse.json({}, { status: 200 });
  return setCorsHeaders(response);
}

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { type, period, force } = body;

    console.log('接收到热榜请求:', { type, period, force });

    // 检查请求参数
    if (!type) {
      return setCorsHeaders(
        NextResponse.json(
          {
            code: 400,
            message: '无效的热榜类型',
            data: { list: [], updateTime: Date.now(), total: 0 },
          },
          { status: 200 },
        ),
      );
    }

    console.log('正在调用外部API:', API_BASE_URL);

    // 调用外部API获取数据
    const response = await axios.post(
      API_BASE_URL,
      { type, period: period || 'weekly', force: force || false },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10秒超时
      },
    );

    console.log('外部API响应状态:', response.status);
    console.log('外部API响应数据:', response.data);

    // 确保响应数据符合预期格式
    let responseData = response.data?.data;

    // 如果数据不符合预期格式，进行转换
    if (!responseData || !responseData.list) {
      console.warn('外部API返回的数据格式不符合预期，尝试转换');

      // 尝试获取数据部分
      const rawData = response.data?.data || response.data;

      if (Array.isArray(rawData)) {
        // 如果是数组，包装成预期格式
        responseData = {
          list: rawData,
          updateTime: Date.now(),
          total: rawData.length,
        };
      } else {
        // 如果无法处理，返回空数据
        responseData = {
          list: [],
          updateTime: Date.now(),
          total: 0,
        };
      }
    }

    // 返回从外部API获取的数据
    return setCorsHeaders(
      NextResponse.json(
        {
          code: 0,
          message: 'success',
          data: responseData,
        },
        { status: 200 },
      ),
    );
  } catch (error: any) {
    console.error('处理热榜请求失败:', error.message);

    if (error.response) {
      console.error('API响应状态:', error.response.status);
      console.error('API响应数据:', error.response.data);
    } else if (error.request) {
      console.error('没有收到响应，请求信息:', error.request);
    }

    // 获取具体错误信息
    const errorMessage =
      error.response?.data?.message || error.message || '服务器内部错误';

    // 即使出错也返回有效的数据结构，避免前端解析错误
    return setCorsHeaders(
      NextResponse.json(
        {
          code: 500,
          message: errorMessage,
          data: { list: [], updateTime: Date.now(), total: 0 },
        },
        { status: 200 },
      ),
    );
  }
}
