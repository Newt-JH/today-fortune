import { NextRequest, NextResponse } from 'next/server';

// 애정운 목업 데이터
const MOCK_LOVE_DATA = {
  bornLoveData: {
    score: 70,
    text: "타고난 (★☆★) 남성의 애정운을 예상하면, 매력과 관계 맺기에 강한 기운을 가지고 있습니다. 자신이 좋아하는 사람에게는 적극적으로 다가가고 자신의 호의를 잘 전달합니다. 이들은 사랑에 빠지면 깊이 몰입하며 상대방에게 헌신적인 모습을 보입니다. 또한, 이들은 대화를 즐기고 상대방의 말을 잘 들어주어, 관계에서 긍정적인 분위기를 만듭니다."
  },
  yearlyLoveData: {
    score: 70,
    text: "부일일 (★☆★) 남성의 애정운을 예상하면, 매력과 관계 맺기에 강한 기운을 가지고 있습니다. 자신이 좋아하는 사람에게는 적극적으로 다가가고 자신의 호의를 잘 전달합니다. 이들은 사랑에 빠지면 깊이 몰입하며 상대방에게 헌신적인 모습을 보입니다. 또한, 이들은 대화를 즐기고 상대방의 말을 잘 들어주어, 관계에서 긍정적인 분위기를 만듭니다."
  },
  todayLoveData: {
    score: 82,
    text: "한밤 예정운을 오늘에 발고나봐 단순한 말 잘 듣기는 더욱 심화되며 기능에선 일부러 막습니다. 상대방이 기쁨과 슬픔을 공유할 수 있는 이해심도 높고, 배려 있는 태도를 보이기 때문에 관계가 오래 지속되는 경향이 강합니다. 사랑하는 사람과 갈등이 있을 때도 감정적으로 치우치기보다는 조리 있게 해결하려는 자세가 돋보입니다."
  },
  yearlyChartData: [
    { year: 2002, age: 19, percent: 34 },
    { year: 2003, age: 20, percent: 49 },
    { year: 2007, age: 24, percent: 39 },
    { year: 2008, age: 25, percent: 39 },
    { year: 2012, age: 29, percent: 44 },
    { year: 2013, age: 30, percent: 49 },
    { year: 2019, age: 36, percent: 39 },
    { year: 2020, age: 37, percent: 46 },
    { year: 2022, age: 39, percent: 34 },
    { year: 2023, age: 40, percent: 50 }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, calendar, birth, time, gender } = body;

    console.log('애정운 요청 - 사주 정보:', { name, calendar, birth, time, gender });

    return NextResponse.json({
      success: true,
      data: MOCK_LOVE_DATA,
    });
  } catch (error) {
    console.error('애정운 API 에러:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch love fortune data' },
      { status: 500 }
    );
  }
}
