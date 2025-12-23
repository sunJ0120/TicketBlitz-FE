import {useEffect, useState, useRef} from 'react';
import {motion, useScroll, useTransform, useInView} from 'framer-motion';
import {concertAPI, type MainPageResponse} from '../api/concert';

// 타이핑 효과 컴포넌트
function TypingText({text, className, delay = 0}: {
  text: string;
  className?: string;
  delay?: number
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [text, started]);

  return (
      <span className={className}>
      {displayedText}
        {displayedText.length < text.length && (
            <span className="animate-pulse">|</span>
        )}
    </span>
  );
}

// 스크롤 시 나타나는 애니메이션 래퍼
function ScrollReveal({
                        children,
                        delay = 0,
                        direction = 'up'
                      }: {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {once: true, margin: "-100px"});

  const directions = {
    up: {y: 60, x: 0},
    down: {y: -60, x: 0},
    left: {y: 0, x: 60},
    right: {y: 0, x: -60},
  };

  return (
      <motion.div
          ref={ref}
          initial={{
            opacity: 0,
            y: directions[direction].y,
            x: directions[direction].x
          }}
          animate={isInView ? {opacity: 1, y: 0, x: 0} : {}}
          transition={{
            duration: 0.8,
            delay,
            ease: [0.25, 0.1, 0.25, 1]
          }}
      >
        {children}
      </motion.div>
  );
}

// 상태 배지 컴포넌트
function StatusBadge({status}: { status: string }) {
  switch (status) {
    case 'BOOKING_OPEN':
      return (
          <span className="px-3 py-1 bg-pink-500 text-white text-sm font-medium rounded-full">
          예매중
        </span>
      );
    case 'SCHEDULED':
      return (
          <span
              className="px-3 py-1 bg-zinc-700 text-white text-sm font-medium rounded-full border border-zinc-600">
          오픈예정
        </span>
      );
    case 'SOLD_OUT':
      return (
          <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
          매진
        </span>
      );
    case 'BOOKING_CLOSED':
      return (
          <span className="px-3 py-1 bg-zinc-600 text-white text-sm font-medium rounded-full">
          예매마감
        </span>
      );
    default:
      return null;
  }
}

export function MainPage() {
  const [data, setData] = useState<MainPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 패럴랙스용 스크롤 훅
  const {scrollYProgress} = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const fetchMainData = async () => {
      try {
        const result = await concertAPI.getMainPage();
        setData(result);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMainData();
  }, []);

  // 날짜 포맷 함수
  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const startStr = `${start.getFullYear()}.${String(start.getMonth() + 1).padStart(2, '0')}.${String(start.getDate()).padStart(2, '0')}`;

    if (endDate) {
      const end = new Date(endDate);
      const endStr = `${String(end.getMonth() + 1).padStart(2, '0')}.${String(end.getDate()).padStart(2, '0')}`;
      return `${startStr} - ${endStr}`;
    }
    return startStr;
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
              className="text-white text-xl"
              animate={{opacity: [0.5, 1, 0.5]}}
              transition={{duration: 1.5, repeat: Infinity}}
          >
            Loading...
          </motion.div>
        </div>
    );
  }

  if (error || !data) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-400 text-xl">{error || '데이터를 찾을 수 없습니다.'}</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen scroll-smooth">
        {/* Hero Section - 패럴랙스 효과 */}
        <motion.section
            className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-purple-900/20 to-transparent overflow-hidden"
            style={{y: heroY, opacity: heroOpacity}}
        >
          {/* 배경 그라데이션 애니메이션 */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl"
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                }}
                transition={{duration: 20, repeat: Infinity, ease: "linear"}}
            />
            <motion.div
                className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-pink-500/10 rounded-full blur-3xl"
                animate={{
                  x: [0, -100, 0],
                  y: [0, -50, 0],
                }}
                transition={{duration: 15, repeat: Infinity, ease: "linear"}}
            />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* 상단 배지 */}
            <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/80 rounded-full border border-zinc-700 mb-8"
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.5}}
            >
              <span>🎫</span>
              <span className="text-zinc-300">
              지금 예매 오픈 중인 공연 <span
                  className="text-white font-semibold">{data.openCount}개</span>
            </span>
            </motion.div>

            {/* 메인 타이틀 - 타이핑 효과 */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 h-[1.2em]">
              <TypingText text="당신이 기다린" delay={300}/>
            </h1>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 h-[1.2em]">
              <TypingText
                  text="그 순간을 예매하세요"
                  className="bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent"
                  delay={1500}
              />
            </h2>

            {/* 서브 텍스트 */}
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 3, duration: 1}}
            >
              <p className="text-zinc-400 text-lg mb-2">
                100만 동시 접속에도 끄떡없는 안정적인 티켓팅.
              </p>
              <p className="text-zinc-400 text-lg mb-10">
                더 이상 새로고침의 지옥은 없습니다.
              </p>
            </motion.div>

            {/* CTA 버튼 */}
            <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 3.5, duration: 0.8}}
            >
              <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full"
                  whileHover={{scale: 1.05, boxShadow: "0 0 30px rgba(236, 72, 153, 0.5)"}}
                  whileTap={{scale: 0.95}}
              >
                공연 둘러보기
              </motion.button>
              <motion.button
                  className="px-8 py-4 bg-zinc-800 text-white font-semibold rounded-full border border-zinc-700"
                  whileHover={{scale: 1.05, backgroundColor: "rgba(63, 63, 70, 1)"}}
                  whileTap={{scale: 0.95}}
              >
                예매 방법 알아보기
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Hot Concerts Section */}
        <section className="py-24 px-6 snap-start">
          <div className="max-w-6xl mx-auto">
            {/* 섹션 헤더 */}
            <ScrollReveal>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>🔥</span> 지금 핫한 공연
                  </h2>
                  <p className="text-zinc-500 mt-1">가장 많은 관심을 받고 있는 공연들</p>
                </div>
                <motion.a
                    href="/concerts"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                    whileHover={{x: 5}}
                >
                  전체보기 →
                </motion.a>
              </div>
            </ScrollReveal>

            {/* 공연 리스트 */}
            <div className="space-y-4">
              {data.featuredConcerts.map((concert, index) => (
                  <ScrollReveal key={concert.id} delay={index * 0.1}>
                    <motion.div
                        className="group cursor-pointer"
                        whileHover={{scale: 1.02}}
                        transition={{duration: 0.2}}
                    >
                      {/* 카드 메인 */}
                      <div
                          className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 rounded-xl p-6 hover:from-purple-600 hover:to-pink-600 transition-all relative overflow-hidden">
                        {/* 호버 시 빛나는 효과 */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                            whileHover={{translateX: "200%"}}
                            transition={{duration: 0.6}}
                        />

                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex-1">
                            {/* 날짜 */}
                            <p className="text-purple-200 text-sm mb-2">
                              {formatDateRange(concert.startDate, concert.endDate)}
                            </p>
                            {/* 제목 */}
                            <h3 className="text-xl font-bold text-white mb-1">
                              {concert.title}
                            </h3>
                            {/* 장소 */}
                            <p className="text-purple-200 text-sm">
                              {concert.venueName}
                            </p>
                          </div>
                          {/* 상태 배지 */}
                          <StatusBadge status={concert.status || 'BOOKING_OPEN'}/>
                        </div>
                      </div>
                      {/* 카드 하단 정보 */}
                      <div className="flex items-center justify-between px-2 py-3 text-sm">
                        <span className="text-zinc-500">{concert.genreDisplayName}</span>
                        <span className="text-white font-semibold">
                      {concert.minPrice.toLocaleString()}원 ~
                    </span>
                      </div>
                    </motion.div>
                  </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why TICKETBLITZ Section */}
        <section className="py-24 px-6 bg-zinc-900/50 snap-start">
          <div className="max-w-4xl mx-auto">
            {/* 섹션 헤더 */}
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  왜 TICKETBLITZ인가요?
                </h2>
                <p className="text-zinc-500">다른 티켓팅과는 차원이 다릅니다</p>
              </div>
            </ScrollReveal>

            {/* 기능 카드 */}
            <div className="space-y-6">
              {/* 초고속 대기열 */}
              <ScrollReveal delay={0.1} direction="left">
                <motion.div
                    className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50"
                    whileHover={{borderColor: "rgba(168, 85, 247, 0.5)", y: -5}}
                    transition={{duration: 0.3}}
                >
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold text-white mb-2">초고속 대기열</h3>
                  <p className="text-zinc-400">
                    Redis 기반 분산 대기열로 100만 동시접속도 안정적으로 처리
                  </p>
                </motion.div>
              </ScrollReveal>

              {/* 공정한 예매 */}
              <ScrollReveal delay={0.2} direction="right">
                <motion.div
                    className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50"
                    whileHover={{borderColor: "rgba(168, 85, 247, 0.5)", y: -5}}
                    transition={{duration: 0.3}}
                >
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="text-xl font-bold text-white mb-2">공정한 예매</h3>
                  <p className="text-zinc-400">
                    분산 락 시스템으로 동시성 이슈 없이 선착순 보장
                  </p>
                </motion.div>
              </ScrollReveal>

              {/* 실시간 모니터링 */}
              <ScrollReveal delay={0.3} direction="left">
                <motion.div
                    className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50"
                    whileHover={{borderColor: "rgba(168, 85, 247, 0.5)", y: -5}}
                    transition={{duration: 0.3}}
                >
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-white mb-2">실시간 모니터링</h3>
                  <p className="text-zinc-400">
                    대기 순번과 예상 시간을 실시간으로 확인
                  </p>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-24 px-6 snap-start">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                지금 바로 시작하세요
              </h2>
              <p className="text-zinc-400 mb-8">
                더 이상 티켓팅 전쟁에서 지지 마세요
              </p>
              <motion.button
                  className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full text-lg"
                  whileHover={{scale: 1.05, boxShadow: "0 0 40px rgba(236, 72, 153, 0.5)"}}
                  whileTap={{scale: 0.95}}
              >
                공연 둘러보기
              </motion.button>
            </div>
          </ScrollReveal>
        </section>
      </div>
  );
}