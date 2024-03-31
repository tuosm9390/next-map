/*global kakao*/
import { locationState, mapState } from "@/atom";
import Script from "next/script";
import { useRecoilValue, useSetRecoilState } from "recoil";

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapProps {
  lat?: string | null;
  lng?: string | null;
  zoom?: number;
}

export default function Map({ lat, lng, zoom }: MapProps) {
  const setMap = useSetRecoilState(mapState);
  // home화면 map일 경우는 지정된 위치를 중심, 상세페이지에서는 해당 객체의 lat, lng, zoom 값으로 설정
  const location = useRecoilValue(locationState);

  const loadKakaoMap = () => {
    // div에 표시할 map 컴포넌트 설정
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("map");

      const mapOption = {
        // 지도 중심점
        center: new window.kakao.maps.LatLng(
          lat ?? location.lat,
          lng ?? location.lng
        ),
        level: zoom ?? location.zoom,
      };

      // mapOption을 가진 mapContainer로 map 객체 생성
      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      // recoil state에 저장(전역변수)
      setMap(map);
    });
  };

  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
        onReady={loadKakaoMap}
      />
      <div
        id="map"
        className="w-full h-screen"
      ></div>
    </>
  );
}
