import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {concertAPI, type ConcertDetail} from '../api/concert';

// 섹션 색상 매핑
const sectionColors: Record<string, string> = {
  'VIP석': '#FFD700',
  'R석': '#FF69B4',
  'S석': '#4FC3F7',
  'A석': '#66BB6A',
};

export function ConcertDetailPage() {
  const {id} = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [concert, setConcert] = useState<ConcertDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({hours: 0, minutes: 0, seconds: 0});
  const [isBookingOpen, setIsBookingOpen] = useState(false);  // 이거 추가!

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await concertAPI.getDetail(Number(id));
        setConcert(data);
      } catch (err) {
        console.error('Failed to fetch concert detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // 카운트다운 타이머
  useEffect(() => {
    if (!concert) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(concert.bookingStartAt).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsBookingOpen(true);
        setCountdown({hours: 0, minutes: 0, seconds: 0});
      } else {
        setIsBookingOpen(false);
        setCountdown({
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [concert]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[date.getDay()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${date.getFullYear()}.${month}.${day} (${dayName}) ${hours}:${minutes}`;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString() + '원';
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
    );
  }

  if (!concert) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-red-400 text-xl">공연을 찾을 수 없습니다.</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
        {/* Header */}
        <header
            className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
                ←
              </button>
              <div className="flex items-center gap-2">
                <div
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
                  T
                </div>
                <span className="font-semibold">TICKETBLITZ</span>
              </div>
            </div>
            <button
                className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition">
              로그인
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* 포스터 */}
              <div className="lg:w-[280px] flex-shrink-0">
                <div
                    className="aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-purple-800">
                  {concert.posterUrl ? (
                      <img src={concert.posterUrl} alt={concert.title}
                           className="w-full h-full object-cover"/>
                  ) : (
                      <div
                          className="w-full h-full flex flex-col items-center justify-center text-white p-6">
                        <span className="text-sm opacity-70">WORLD TOUR</span>
                        <span className="text-2xl font-bold mt-2">{concert.artist}</span>
                        <span
                            className="text-sm opacity-70 mt-1">{concert.title.split(' ').pop()}</span>
                      </div>
                  )}
                </div>
              </div>

              {/* 정보 섹션 */}
              <div className="flex-1 space-y-6">
                {/* 태그 */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-gray-700 text-sm">콘서트</span>
                  <span
                      className="px-3 py-1 rounded-full bg-gray-700 text-sm">{concert.genreDisplayName}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                      concert.status === 'BOOKING_OPEN'
                          ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                          : 'bg-gray-700 text-gray-300'
                  }`}>
                  {concert.statusDisplayName}
                </span>
                </div>

                {/* 제목 & 장소 */}
                <div>
                  <h1 className="text-3xl font-bold">{concert.title}</h1>
                  <p className="text-gray-400 mt-2">{concert.buildingName} {concert.hallName}</p>
                </div>

                {/* 카운트다운 */}
                {!isBookingOpen ? (
                    <div className="bg-[#1a1a1a] rounded-xl p-6">
                      <p className="text-center text-gray-400 mb-4">예매 오픈까지</p>
                      <div className="flex justify-center gap-4">
                        {[
                          { value: countdown.hours, label: '시간' },
                          { value: countdown.minutes, label: '분' },
                          { value: countdown.seconds, label: '초' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                              <div className="w-16 h-16 bg-gradient-to-b from-purple-900/80 to-purple-950 border border-purple-500/40 rounded-lg flex items-center justify-center text-2xl font-bold text-white">
                                {String(item.value).padStart(2, '0')}
                              </div>
                              <span className="text-xs text-gray-400 mt-2 block">{item.label}</span>
                            </div>
                        ))}
                      </div>
                      <p className="text-center text-gray-500 text-sm mt-4">
                        오픈 시간: {formatDate(concert.bookingStartAt)}
                      </p>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 text-center">
                      <p className="text-2xl font-semibold text-purple-400">🎉 예매가 오픈되었습니다!</p>
                      <p className="text-gray-400 mt-2">지금 바로 좌석을 선택하세요</p>
                    </div>
                )}

                {/* 공연 일정 */}
                <div>
                  <h3 className="text-gray-400 mb-3">공연 일정</h3>
                  <div className="flex gap-3">
                    <button className="px-4 py-3 bg-purple-600 rounded-lg text-sm">
                      <div>{formatDate(concert.startDate).split(' ')[0]}</div>
                      <div
                          className="text-xs opacity-70">{formatDate(concert.startDate).split(' ')[2]}</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 공연 설명 */}
            {concert.description && (
                <div className="mt-8 bg-[#1a1a1a] rounded-xl p-6">
                  <h3 className="font-semibold mb-4">공연 소개</h3>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                    {concert.description}
                  </p>
                </div>
            )}

            {/* 가격 정보 */}
            <div className="mt-8 bg-[#1a1a1a] rounded-xl p-6">
              <h3 className="font-semibold mb-4">가격 정보</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {concert.sections.map((section, i) => (
                    <div key={i} className="bg-[#2a2a2a] rounded-lg p-4 text-center">
                      <div
                          className="w-3 h-3 rounded-full mx-auto mb-2"
                          style={{backgroundColor: sectionColors[section.sectionName] || '#888'}}
                      />
                      <div className="text-gray-400 text-sm">{section.sectionName}</div>
                      <div className="font-bold mt-1">{formatPrice(section.price)}</div>
                    </div>
                ))}
              </div>
            </div>

            {/* 예매 유의사항 */}
            <div className="mt-8 bg-[#1a1a1a] rounded-xl p-6">
              <h3 className="font-semibold mb-4">예매 유의사항</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>• 1인 최대 4매까지 예매 가능합니다.</li>
                <li>• 예매 후 취소 시 취소 수수료가 발생할 수 있습니다.</li>
                <li>• 공연 시작 후에는 입장이 제한될 수 있습니다.</li>
                <li>• 본 공연은 만 7세 이상 관람 가능합니다.</li>
              </ul>
            </div>
          </div>
        </main>

        {/* 하단 고정 바 */}
        <footer
            className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-white/10 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <div className="font-semibold">{formatDate(concert.startDate)}</div>
              <div className="text-gray-400 text-sm">{concert.buildingName} {concert.hallName}</div>
            </div>
            <div className="flex items-center gap-4">
              {!isBookingOpen && (
                  <div className="text-right">
                    <div className="text-gray-400 text-sm">오픈까지</div>
                    <div className="font-mono">
                      {String(countdown.hours).padStart(2, '0')}:
                      {String(countdown.minutes).padStart(2, '0')}:
                      {String(countdown.seconds).padStart(2, '0')}
                    </div>
                  </div>
              )}

              {isBookingOpen ? (
                  <button
                      onClick={() => navigate(`/concerts/${id}/seats`)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    예매하기
                  </button>
              ) : (
                  <button
                      className="px-6 py-3 bg-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
                      disabled
                  >
                    오픈 대기중
                  </button>
              )}
            </div>
          </div>
        </footer>
      </div>
  );
}