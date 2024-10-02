'use client'

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useQuery } from '@tanstack/react-query'
import axios from "axios";
import { format, parseISO, fromUnixTime } from "date-fns";
import Container from "@/components/Container";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/KelvinToCelsius";
import { getDayOrNightIcon } from "@/utils/DayOrNightIcon";
import WeatherDetails from "@/components/WeatherDetails";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { metersToKilometers } from "@/utils/metersToKilometers";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import { formatDateWithSuffix } from "@/utils/getOrdinalSuffix";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { getBackgroundImage } from "@/utils/getBackgroundImage";

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
  const [place] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  const { isPending, data, refetch } = useQuery<WeatherData>({
    queryKey: ['repoData'],
    queryFn: async () => {
      const {data} = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  });

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const todayData = data?.list[0];

  console.log(data)

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 9;
    });
  });

  const backgroundImage = getBackgroundImage(
    todayData?.weather[0].main ?? '',
    todayData?.weather[0].description ?? ''
  );

  if (isPending)
    return(
    <div
    className="flex flex-col gap-4 min-h-screen w-full items-center justify-center">
      <WeatherSkeleton />
    </div>
    );

  return (
    <div className="flex flex-col gap-4 min-h-screen bg-gray-100">
      <Navbar
      location={data?.city.name}/>

      <main className="px-3 py-4 max-w-7xl mx-auto flex flex-col gap-9 w-full">

      {/* Today's data */}
      {loadingCity ? (
        <WeatherSkeleton />
      ) : (
        <>
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="flex gap-1 text-2xl items-end">
          {format(parseISO(todayData?.dt_txt ?? ""), "EEEE")}
          </h2>

           <Container
           className="gap-10 px-6 items-center"
           >
            {/* Temperature */}
            <div
            className="flex flex-col p-4 h-full rounded items-center justify-center"
            style={{
              backgroundImage: `url(${backgroundImage.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>

              <span className="text-5xl">
              {convertKelvinToCelsius(todayData?.main.temp ?? 296.37)}°
              </span>

              <p className="text-sm space-x-1 whitespace-nowrap my-2 bg-gray-200/60 rounded p-1">
                      <span> Feels like</span>
                      <span>
                        {convertKelvinToCelsius(
                          todayData?.main.feels_like ?? 0
                        )}
                        °
                      </span>
              </p>
              <p className="text-sm space-x-2 bg-gray-200/60 rounded p-1">
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
              {data?.list.slice(0, 7).map((todayTimeData, i) =>
              <div
              key={i}
              className="flex flex-col justify-between gap-2 items-center text-xs"
              >
                <p className="whitespace-nowrap font-semibold">
                  {format(parseISO(todayTimeData.dt_txt), "h:mm a")}
                </p>

                <WeatherIcon iconname={getDayOrNightIcon(todayTimeData.weather[0].icon, todayTimeData.dt_txt)}/>

                <p>
                  {convertKelvinToCelsius(todayTimeData.main.temp ?? 0)}°
                </p>
              </div>

              )}

            </div>
           </Container>
           {/* Extra details on today's weather */}

            </div>
            <div className="flex gap-4">
            <Container className="w-fit  justify-center flex-col px-6 items-center ">
                  <p className=" capitalize text-center">
                    {todayData?.weather[0].description}{" "}
                  </p>
                  <WeatherIcon
                    iconname={getDayOrNightIcon(
                      todayData?.weather[0].icon ?? "",
                      todayData?.dt_txt ?? ""
                    )}
                  />
            </Container>
            <Container className="px-6 gap-4 justify-between overflow-x-auto">
                  <WeatherDetails
                    visability={metersToKilometers(
                      todayData?.visibility ?? 10000
                    )}
                    airPressure={`${todayData?.main.pressure} hPa`}
                    humidity={`${todayData?.main.humidity}%`}
                    sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702949452), "HH:mm")}
                    sunset={format(fromUnixTime(data?.city.sunset ?? 1702949452), "HH:mm")}
                    windSpeed={convertWindSpeed(todayData?.wind.speed ?? 1.64)}
                  />
            </Container>
        </div>
      </section>

      {/* 7 day forecast data*/}
      <section className="flex w-full flex-col gap-4">
        <p className="text-2xl"> 7 Day Forecast </p>
        {firstDataForEachDate.map((d, i) => (
                <ForecastWeatherDetail
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  day={d ? format(parseISO(d.dt_txt), "EEEE") : "EEEE"}
                  date={d ? formatDateWithSuffix(d.dt_txt) : format(new Date(), "EEEE")}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  airPressure={`${d?.main.pressure} hPa `}
                  humidity={`${d?.main.humidity}% `}
                  sunrise={format(
                    fromUnixTime(data?.city.sunrise ?? 1702517657),
                    "H:mm"
                  )}
                  sunset={format(
                    fromUnixTime(data?.city.sunset ?? 1702517657),
                    "H:mm"
                  )}
                  visability={`${metersToKilometers(d?.visibility ?? 10000)} `}
                  windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
                  style={{
                    backgroundImage: `url(${getBackgroundImage(
                      d?.weather[0].main ?? '', d?.weather[0].description ?? '').src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              ))}
      </section>
    </>
    )}
  </main>
  </div>
  );
}

function WeatherSkeleton() {
  return (
    <section className="space-y-8 ">
      {/* Today's data skeleton */}
      <div className="space-y-2 animate-pulse">
        {/* Date skeleton */}
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      <p className="animate-bounce w-full text-center justify-center font-semibold text-gray-500"> Loading...</p>

      {/* 7 days forecast skeleton */}
      <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}