import { useState, useEffect, useRef, useCallback } from 'react';
import { concertAPI } from '../api/concert';
import type { ConcertSummary, ConcertSearchParams } from '../api/concert';

// 필터 컴포넌트 (나중에 구현)
interface PriceFilterProps {
  tempRange: [number, number];
  setTempRange: (range: [number, number]) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

const PriceFilterPopup = ({ tempRange, setTempRange, onApply, onReset, onClose }: PriceFilterProps) => {
  const minPrice = 0;
  const maxPrice = 500000;
  const step = 10000;

  const minPercent = ((tempRange[0] - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPercent = ((tempRange[1] - minPrice) / (maxPrice - minPrice)) * 100;

  return (
      <div className="absolute top-full left-0 mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-xl p-5 z-50 shadow-xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-5">
          <span className="font-semibold">가격 범위</span>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl">&times;</button>
        </div>

        {/* 가격 표시 */}
        <div className="flex justify-center items-center gap-3 mb-6 text-lg font-semibold text-purple-400">
          <span>{tempRange[0].toLocaleString()}원</span>
          <span className="text-zinc-500">~</span>
          <span>{tempRange[1].toLocaleString()}원</span>
        </div>

        {/* 슬라이더 */}
        <div className="relative h-10 flex items-center mb-2">
          {/* 트랙 배경 */}
          <div className="absolute w-full h-1 bg-zinc-700 rounded" />
          {/* 선택 범위 */}
          <div
              className="absolute h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded"
              style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
          />
          {/* Min 슬라이더 */}
          <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step={step}
              value={tempRange[0]}
              onChange={(e) => {
                const value = Math.min(Number(e.target.value), tempRange[1] - step);
                setTempRange([value, tempRange[1]]);
              }}
              className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
          />
          {/* Max 슬라이더 */}
          <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step={step}
              value={tempRange[1]}
              onChange={(e) => {
                const value = Math.max(Number(e.target.value), tempRange[0] + step);
                setTempRange([tempRange[0], value]);
              }}
              className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>

        {/* 범위 라벨 */}
        <div className="flex justify-between text-xs text-zinc-500 mb-5">
          <span>0원</span>
          <span>50만원</span>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
              onClick={onReset}
              className="flex-1 py-2.5 border border-zinc-600 rounded-lg text-zinc-400 hover:bg-zinc-800 transition"
          >
            초기화
          </button>
          <button
              onClick={onApply}
              className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:opacity-90 transition"
          >
            적용
          </button>
        </div>
      </div>
  );
};

interface DateFilterProps {
  tempRange: { start: Date | null; end: Date | null };
  setTempRange: (range: { start: Date | null; end: Date | null }) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

const DateFilterPopup = ({ tempRange, setTempRange, onApply, onReset, onClose }: DateFilterProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);

  const handleDayClick = (year: number, month: number, day: number) => {
    const clickedDate = new Date(year, month, day);

    if (!tempRange.start || (tempRange.start && tempRange.end)) {
      // 첫 선택 or 리셋
      setTempRange({ start: clickedDate, end: null });
    } else {
      // 두 번째 선택
      if (clickedDate < tempRange.start) {
        setTempRange({ start: clickedDate, end: tempRange.start });
      } else {
        setTempRange({ start: tempRange.start, end: clickedDate });
      }
    }
  };

  const formatDisplayDate = () => {
    if (!tempRange.start) return null;
    const format = (d: Date) => `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
    if (!tempRange.end) return format(tempRange.start);
    return `${format(tempRange.start)} ~ ${format(tempRange.end)}`;
  };

  return (
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-zinc-900 border border-zinc-700 rounded-xl p-5 z-50 shadow-xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-5">
          <span className="font-semibold">공연 날짜 선택</span>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl">&times;</button>
        </div>

        {/* 달력 2개 */}
        <div className="flex gap-6">
          <Calendar
              month={currentMonth}
              onPrevMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              tempRange={tempRange}
              onDayClick={handleDayClick}
          />
          <Calendar
              month={nextMonth}
              onPrevMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              tempRange={tempRange}
              onDayClick={handleDayClick}
          />
        </div>

        {/* 선택된 범위 표시 */}
        {tempRange.start && (
            <div className="mt-4 py-3 px-4 bg-purple-500/10 rounded-lg text-center text-sm text-zinc-300">
              {formatDisplayDate()}
            </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-3 mt-5">
          <button
              onClick={onReset}
              className="flex-1 py-2.5 border border-zinc-600 rounded-lg text-zinc-400 hover:bg-zinc-800 transition"
          >
            초기화
          </button>
          <button
              onClick={onApply}
              className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:opacity-90 transition"
          >
            적용
          </button>
        </div>
      </div>
  );
};

// 달력 컴포넌트
interface CalendarProps {
  month: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  tempRange: { start: Date | null; end: Date | null };
  onDayClick: (year: number, month: number, day: number) => void;
}

const Calendar = ({ month, onPrevMonth, onNextMonth, tempRange, onDayClick }: CalendarProps) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isStart = (day: number) => {
    if (!tempRange.start) return false;
    const date = new Date(year, monthIndex, day);
    return date.toDateString() === tempRange.start.toDateString();
  };

  const isEnd = (day: number) => {
    if (!tempRange.end) return false;
    const date = new Date(year, monthIndex, day);
    return date.toDateString() === tempRange.end.toDateString();
  };

  const isInRange = (day: number) => {
    if (!tempRange.start || !tempRange.end) return false;
    const date = new Date(year, monthIndex, day);
    return date > tempRange.start && date < tempRange.end;
  };

  const isPast = (day: number) => {
    const date = new Date(year, monthIndex, day);
    return date < today;
  };

  return (
      <div className="flex-1">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={onPrevMonth} className="text-zinc-400 hover:text-white px-2">&lt;</button>
          <span className="font-medium">{year}년 {monthNames[monthIndex]}</span>
          <button onClick={onNextMonth} className="text-zinc-400 hover:text-white px-2">&gt;</button>
        </div>

        {/* 요일 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
              <div key={day} className="text-center text-xs text-zinc-500 py-2">{day}</div>
          ))}
        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
              <div
                  key={index}
                  onClick={() => day && !isPast(day) && onDayClick(year, monthIndex, day)}
                  className={`
              aspect-square flex items-center justify-center text-sm rounded-full cursor-pointer transition
              ${!day ? '' : ''}
              ${day && isPast(day) ? 'text-zinc-700 cursor-not-allowed' : ''}
              ${day && !isPast(day) && !isStart(day) && !isEnd(day) && !isInRange(day) ? 'hover:bg-zinc-700' : ''}
              ${day && isStart(day) ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold' : ''}
              ${day && isEnd(day) ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold' : ''}
              ${day && isInRange(day) ? 'bg-purple-500/30' : ''}
            `}
              >
                {day}
              </div>
          ))}
        </div>
      </div>
  );
};

export default function ConcertListPage() {
  // 검색 조건
  const [keyword, setKeyword] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [sortType, setSortType] = useState<'CONCERT_DATE' | 'VIEW_COUNT' | 'PRICE'>('CONCERT_DATE');
  const [isAsc, setIsAsc] = useState(true);

  // 상태 추가
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 500000]);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  // 데이터 상태
  const [concerts, setConcerts] = useState<ConcertSummary[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  // 무한스크롤
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // fetchConcerts 수정 - loading, hasNext 의존성 제거
  const loadingRef = useRef(false);
  const hasNextRef = useRef(true);

  const fetchConcerts = useCallback(async (cursor?: string, isNewSearch = false) => {
    if (loadingRef.current) return;
    if (!isNewSearch && !hasNextRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    try {
      const params: ConcertSearchParams = {
        keyword: keyword || undefined,
        genre: genre || undefined,
        status: status || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 500000 ? priceRange[1] : undefined,
        startDate: dateRange.start?.toISOString().split('T')[0],
        endDate: dateRange.end?.toISOString().split('T')[0],
        cursor: cursor || undefined,
        size: 20,
        sortType,
        isAsc,
      };

      const data = await concertAPI.getList(params);

      if (isNewSearch) {
        setConcerts(data.content);
      } else {
        // 중복 제거
        setConcerts(prev => {
          const existingIds = new Set(prev.map((c: ConcertSummary) => c.id));
          const newConcerts = data.content.filter((c: ConcertSummary) => !existingIds.has(c.id));
          return [...prev, ...newConcerts];
        });
      }
      setNextCursor(data.nextCursor);
      hasNextRef.current = data.hasNext;
      setHasNext(data.hasNext);
    } catch (err) {
      console.error(err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [keyword, genre, status, priceRange, dateRange, sortType, isAsc]);

  // 초기 로딩
  useEffect(() => {
    setConcerts([]);
    setNextCursor(null);
    hasNextRef.current = true;
    setHasNext(true);
    fetchConcerts(undefined, true);
  }, [genre, status, sortType, isAsc, priceRange, dateRange]);

  // 무한스크롤 Observer
  useEffect(() => {
    // 이전 observer 정리
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNext && !loading && nextCursor) {
            fetchConcerts(nextCursor);
          }
        },
        { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNext, loading, nextCursor]);

  // 검색 실행
  const handleSearch = () => {
    setConcerts([]);
    setNextCursor(null);
    setHasNext(true);
    fetchConcerts(undefined, true);
  };

  // 날짜 포맷 함수
  const formatDateRange = () => {
    if (!dateRange.start) return '날짜 선택';
    const format = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
    if (!dateRange.end) return format(dateRange.start);
    return `${format(dateRange.start)} - ${format(dateRange.end)}`;
  };

  return (
      <div className="min-h-screen bg-zinc-950 text-white">
        {/* 메인 컨텐츠 */}
        <main className="max-w-5xl mx-auto px-4 py-8 mt-16">
          {/* 페이지 타이틀 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              공연 둘러보기
            </h1>
            <p className="text-zinc-500 text-sm mt-1">지금 예매 가능한 공연을 확인하세요</p>
          </div>

          {/* 검색 & 필터 섹션 */}
          <div className="bg-zinc-900 rounded-xl p-4 mb-6 border border-zinc-800">
            {/* 검색창 */}
            <div className="relative mb-4">
              <input
                  type="text"
                  placeholder="공연명, 아티스트로 검색"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 pl-10 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition text-sm"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* 필터 행 */}
            <div className="flex flex-wrap gap-3">
              {/* 장르 */}
              <div className="relative">
                <select
                    value={genre}
                    onChange={(e) => { setGenre(e.target.value); }}
                    className="appearance-none px-4 py-2 pr-8 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="">장르 전체</option>
                  <option value="KPOP">K-POP</option>
                  <option value="BALLAD">발라드</option>
                  <option value="ROCK">록/메탈</option>
                  <option value="HIPHOP">힙합</option>
                  <option value="INDIE">인디</option>
                  <option value="CLASSIC">클래식</option>
                  <option value="MUSICAL">뮤지컬</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 pointer-events-none">▼</span>
              </div>

              {/* 상태 */}
              <div className="relative">
                <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value);}}
                    className="appearance-none px-4 py-2 pr-8 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="">상태 전체</option>
                  <option value="BOOKING_OPEN">예매중</option>
                  <option value="SCHEDULED">오픈예정</option>
                  <option value="SOLD_OUT">매진</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 pointer-events-none">▼</span>
              </div>

              {/* 가격 필터 */}
              <div className="relative">
                <button
                    onClick={() => { setShowPriceFilter(!showPriceFilter); setShowDateFilter(false); }}
                    className={`px-4 py-2 rounded-lg border transition text-sm ${
                        priceRange[0] > 0 || priceRange[1] < 500000
                            ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                            : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600'
                    }`}
                >
                  {priceRange[0] > 0 || priceRange[1] < 500000
                      ? `${(priceRange[0] / 10000).toFixed(0)}만 - ${(priceRange[1] / 10000).toFixed(0)}만원`
                      : '가격대'
                  }
                  <span className="ml-2 text-xs">▼</span>
                </button>

                {showPriceFilter && (
                    <PriceFilterPopup
                        tempRange={tempPriceRange}
                        setTempRange={setTempPriceRange}
                        onApply={() => {
                          setPriceRange(tempPriceRange);
                          setShowPriceFilter(false);
                        }}
                        onReset={() => setTempPriceRange([0, 500000])}
                        onClose={() => {
                          setShowPriceFilter(false);
                          setTempPriceRange(priceRange);
                        }}
                    />
                )}
              </div>

              {/* 날짜 필터 */}
              <div className="relative">
                <button
                    onClick={() => { setShowDateFilter(!showDateFilter); setShowPriceFilter(false); }}
                    className={`px-4 py-2 rounded-lg border transition text-sm ${
                        dateRange.start
                            ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                            : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600'
                    }`}
                >
                  {formatDateRange()}
                  <span className="ml-2 text-xs">▼</span>
                </button>

                {showDateFilter && (
                    <DateFilterPopup
                        tempRange={tempDateRange}
                        setTempRange={setTempDateRange}
                        onApply={() => {
                          setDateRange(tempDateRange);
                          setShowDateFilter(false);
                        }}
                        onReset={() => setTempDateRange({ start: null, end: null })}
                        onClose={() => {
                          setShowDateFilter(false);
                          setTempDateRange(dateRange);
                        }}
                    />
                )}
              </div>

              {/* 정렬 */}
              <div className="relative">
                <select
                    value={`${sortType}-${isAsc}`}
                    onChange={(e) => {
                      const [type, asc] = e.target.value.split('-');
                      setSortType(type as 'CONCERT_DATE' | 'VIEW_COUNT' | 'PRICE');
                      setIsAsc(asc === 'true');
                    }}
                    className="appearance-none px-4 py-2 pr-8 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="CONCERT_DATE-true">날짜순</option>
                  <option value="VIEW_COUNT-false">인기순</option>
                  <option value="PRICE-true">가격 낮은순</option>
                  <option value="PRICE-false">가격 높은순</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 pointer-events-none">▼</span>
              </div>
            </div>
          </div>

          {/* 결과 카운트 */}
          <p className="text-zinc-500 text-sm mb-4">
            총 <span className="text-white font-medium">{concerts.length}개</span>의 공연
          </p>

          {/* 콘서트 목록 */}
          <div className="space-y-4">
            {concerts.map((concert) => (
                <div
                    key={concert.id}
                    onClick={() => window.location.href = `/concerts/${concert.id}`}
                    className="flex bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition cursor-pointer"
                >
                  {/* 썸네일 */}
                  <div className="w-36 h-44 bg-gradient-to-br from-purple-600 to-pink-600 flex-shrink-0 flex flex-col items-center justify-center">
                    {concert.posterUrl ? (
                        <img src={concert.posterUrl} alt={concert.title} className="w-full h-full object-cover" />
                    ) : (
                        <>
                          <span className="text-xs text-white/70">CONCERT</span>
                          <span className="text-lg font-bold text-white mt-1">{concert.artist}</span>
                        </>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                  {concert.genreDisplayName}
                </span>
                      <span className={`px-2 py-0.5 text-xs rounded ${
                          concert.status === 'BOOKING_OPEN' ? 'bg-pink-500/20 text-pink-400' :
                              concert.status === 'SCHEDULED' ? 'bg-green-500/20 text-green-400' :
                                  'bg-zinc-500/20 text-zinc-400'
                      }`}>
                  {concert.statusDisplayName}
                </span>
                    </div>

                    <h3 className="font-semibold text-lg mb-1">{concert.title}</h3>
                    <p className="text-zinc-400 text-sm mb-2">{concert.artist}</p>

                    <div className="text-zinc-500 text-sm space-y-0.5 mt-auto">
                      <p>{concert.startDate} - {concert.endDate}</p>
                      <p>{concert.venueName}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
                <span className="text-purple-400 font-semibold">
                  {concert.minPrice.toLocaleString()}원~
                </span>
                      <span className="text-zinc-500 text-sm flex items-center gap-1">
                  👁 {concert.viewCount >= 10000
                          ? `${(concert.viewCount / 10000).toFixed(1)}만`
                          : concert.viewCount >= 1000
                              ? `${(concert.viewCount / 1000).toFixed(1)}K`
                              : concert.viewCount
                      }
                </span>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* 로딩 스피너 */}
          {loading && (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
          )}

          {/* 무한스크롤 트리거 */}
          <div ref={loadMoreRef} className="h-4" />

          {/* 빈 상태 */}
          {!loading && concerts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🎵</div>
                <p className="text-zinc-400">검색 결과가 없습니다</p>
              </div>
          )}

          {/* 끝 표시 */}
          {!hasNext && concerts.length > 0 && (
              <p className="text-center text-zinc-500 py-8">모든 공연을 확인했습니다</p>
          )}
        </main>
      </div>
  );
}