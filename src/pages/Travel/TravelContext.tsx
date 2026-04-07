import React, { createContext, useContext, useState } from 'react';
import { Destination, ItineraryDay } from './mockData';

interface TravelState {
  destinations: Destination[];
  itinerary: ItineraryDay[];
  budget: {
    total: number;
    anUong: number;
    luuTru: number;
    diChuyen: number;
    khac: number;
  };
}

interface TravelContextType extends TravelState {
  setDestinations: (destinations: Destination[]) => void;
  addDestination: (dest: Destination) => void;
  updateDestination: (dest: Destination) => void;
  deleteDestination: (id: string) => void;
  setItinerary: (itinerary: ItineraryDay[]) => void;
  setBudget: (budget: TravelState['budget']) => void;
  totalItineraries: number;
  setTotalItineraries: (n: number) => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider: React.FC = ({ children }) => {
  const [destinations, setDestinations] = useState<Destination[]>([
    { id: '1', name: 'Phú Quốc', location: 'Kiên Giang', type: 'bien', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600', rating: 4.8, visitTime: '3 ngày', foodCost: 500000, stayCost: 1200000, transportCost: 800000, description: 'Đảo ngọc Phú Quốc với bãi biển đẹp.', popular: 320 },
    { id: '2', name: 'Đà Lạt', location: 'Lâm Đồng', type: 'nui', image: 'https://images.unsplash.com/photo-1555400013-5ef1e2bb1c7e?w=600', rating: 4.7, visitTime: '2 ngày', foodCost: 350000, stayCost: 800000, transportCost: 600000, description: 'Thành phố ngàn hoa, khí hậu mát mẻ.', popular: 280 },
    { id: '3', name: 'TP. Hồ Chí Minh', location: 'HCM', type: 'thanh_pho', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600', rating: 4.5, visitTime: '2 ngày', foodCost: 400000, stayCost: 900000, transportCost: 300000, description: 'Thành phố năng động, trung tâm kinh tế.', popular: 450 },
    { id: '4', name: 'Nha Trang', location: 'Khánh Hòa', type: 'bien', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', rating: 4.6, visitTime: '3 ngày', foodCost: 450000, stayCost: 1000000, transportCost: 700000, description: 'Bãi biển Nha Trang tuyệt đẹp.', popular: 390 },
    { id: '5', name: 'Sapa', location: 'Lào Cai', type: 'nui', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600', rating: 4.4, visitTime: '2 ngày', foodCost: 300000, stayCost: 600000, transportCost: 900000, description: 'Núi non Sapa hùng vĩ, ruộng bậc thang.', popular: 260 },
    { id: '6', name: 'Hội An', location: 'Quảng Nam', type: 'thanh_pho', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600', rating: 4.9, visitTime: '2 ngày', foodCost: 380000, stayCost: 750000, transportCost: 500000, description: 'Phố cổ Hội An lung linh.', popular: 410 },
    { id: '7', name: 'Phong Nha', location: 'Quảng Bình', type: 'nui', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600', rating: 4.3, visitTime: '2 ngày', foodCost: 280000, stayCost: 550000, transportCost: 750000, description: 'Hang động Phong Nha kỳ vĩ.', popular: 150 },
    { id: '8', name: 'Côn Đảo', location: 'Bà Rịa Vũng Tàu', type: 'bien', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', rating: 4.7, visitTime: '3 ngày', foodCost: 420000, stayCost: 1100000, transportCost: 950000, description: 'Hòn đảo hoang sơ, bãi biển trong xanh.', popular: 180 },
  ]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [budget, setBudget] = useState<TravelState['budget']>({ total: 0, anUong: 0, luuTru: 0, diChuyen: 0, khac: 0 });
  const [totalItineraries, setTotalItineraries] = useState(0);

  const addDestination = (dest: Destination) => setDestinations((prev) => [...prev, { ...dest, id: String(Date.now()) }]);
  const updateDestination = (dest: Destination) => setDestinations((prev) => prev.map((d) => (d.id === dest.id ? dest : d)));
  const deleteDestination = (id: string) => setDestinations((prev) => prev.filter((d) => d.id !== id));

  return (
    <TravelContext.Provider value={{ destinations, setDestinations, addDestination, updateDestination, deleteDestination, itinerary, setItinerary, budget, setBudget, totalItineraries, setTotalItineraries }}>
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const ctx = useContext(TravelContext);
  if (!ctx) throw new Error('useTravel must be used inside TravelProvider');
  return ctx;
};
