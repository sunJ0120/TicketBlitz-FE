import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

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

export const concertAPI = {
  getMainPage: async (): Promise<MainPageResponse> => {
    const response = await axios.get(`${API_URL}/concerts/main`);
    return response.data;
  },
  getDetail: async (id: number): Promise<ConcertDetail> => {
    const response = await axios.get(`${API_URL}/concerts/${id}`);
    return response.data;
  },
};