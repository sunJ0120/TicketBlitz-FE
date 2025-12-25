import axios from './axios';

export interface Concert {
  id: number;
  title: string;
  artist?: string;
  posterUrl?: string;
  startDate: string;
  endDate?: string;
  genreDisplayName: string;  // genre → genreDisplayName
  venueName: string;
  minPrice: number;
  status: 'SCHEDULED' | 'BOOKING_OPEN' | 'BOOKING_CLOSED' | 'SOLD_OUT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  statusDisplayName: string;  // 추가
}

export interface MainPageResponse {
  openCount: number;  // openConcertsCount → openCount
  featuredConcerts: Concert[];
}

export interface ConcertDetail {
  id: number;
  title: string;
  artist: string;
  description: string;
  posterUrl: string;

  genre: string;
  genreDisplayName: string;
  status: string;
  statusDisplayName: string;

  buildingName: string;
  hallName: string;

  startDate: string;
  endDate: string;
  bookingStartAt: string;
  bookingEndAt: string;

  sections: SectionPrice[];
}

export interface SectionPrice {
  sectionName: string;
  price: number;
}

export interface ConcertSearchParams {
  keyword?: string;
  genre?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  cursor?: string;
  size?: number;
  sortType?: 'CONCERT_DATE' | 'VIEW_COUNT' | 'PRICE' | 'TICKET_OPEN_AT';
  isAsc?: boolean;
}

export interface CursorPageResponse<T> {
  content: T[];
  nextCursor: string | null;
  hasNext: boolean;
  size: number;
  returnedCount: number;
}

export interface ConcertSummary {
  id: number;
  title: string;
  artist: string;
  genreDisplayName: string;
  posterUrl: string | null;
  startDate: string;
  endDate: string;
  venueName: string;
  minPrice: number;
  status: string;
  statusDisplayName: string;
  viewCount: number;
}

export const concertAPI = {
  getMainPage: async () => {
    const response = await axios.get('/pages/main');
    return response.data;
  },
  getDetail: async (id: number) => {
    const response = await axios.get(`/concerts/${id}`);
    return response.data;
  },
  getList: async (params: ConcertSearchParams) => {
    const response = await axios.get('/concerts', { params });
    return response.data;
  },
};