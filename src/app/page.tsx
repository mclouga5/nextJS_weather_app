'use client'

import Navbar from "@/components/Navbar";
import Image from "next/image";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import axios from "axios";
import { format, parseISO } from "date-fns";
import Container from "@/components/Container";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/KelvinToCelsius";
import { getDayOrNightIcon } from "@/utils/DayOrNightIcon";

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {
  const { isPending, error, data } = useQuery<WeatherData>({
    queryKey: ['repoData'],
    queryFn: async () => {
      const {data} = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=london&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  });

  const todayData = data?.list[0];

  if (isPending)
    return(
    <div className="flex items-center min-h-screen justify-center">
      <p className="animate-bounce"> Loading... </p>
    </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />

      <main className="px-3 py-4 max-w-7xl mx-auto flex flex-col gap-9 w-full">

      {/* Today's data*/}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="flex gap-1 text-2xl items-end">
          {format(parseISO(todayData?.dt_txt ?? ""), "EEEE")}
          </h2>

           <Container className="gap-10 px-6 items-center">
            {/* Temperature */}
            <div className="flex flex-col px-4">

              <span className="text-5xl">
              {convertKelvinToCelsius(todayData?.main.temp ?? 296.37)}°
              </span>

              <p className="text-xs space-x-1 whitespace-nowrap">
                      <span> Feels like</span>
                      <span>
                        {convertKelvinToCelsius(
                          todayData?.main.feels_like ?? 0
                        )}
                        °
                      </span>
              </p>
              <p className="text-xs space-x-2">
                      <span>
                        {convertKelvinToCelsius(todayData?.main.temp_min ?? 0)}
                        °↓{" "}
                      </span>
                      <span>
                        {" "}
                        {convertKelvinToCelsius(todayData?.main.temp_max ?? 0)}
                        °↑
                      </span>
              </p>
            </div>

           {/* Time and Weather Icon */}
            <div className="flex gap-1 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
              {data?.list.map((todayTimeData, i) =>
              <div
              key={i}
              className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
              >
                <p className="whitespace-nowrap">
                  {format(parseISO(todayTimeData.dt_txt), "h:mm a")}
                </p>

                <WeatherIcon iconName={getDayOrNightIcon(todayTimeData.weather[0].icon, todayTimeData.dt_txt)}/>

                <p>
                  {convertKelvinToCelsius(todayTimeData.main.temp ?? 0)}°
                </p>
              </div>

              )}

            </div>



           </Container>
        </div>


      </section>

      {/* 7 day forecast data*/}
      <section className="flex w-full flex-col gap-4">
        <p className="text-2xl"> 7 Day Forecast </p>
      </section>

      </main>
    </div>
  );
}
