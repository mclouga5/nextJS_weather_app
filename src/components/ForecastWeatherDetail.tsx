 import {useEffect, useState } from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailProps } from "./WeatherDetails";
import { convertKelvinToCelsius } from "@/utils/KelvinToCelsius";
import { cn } from "@/utils/cn"
import { useInView } from "react-intersection-observer";

export interface ForecastWeatherDetailProps extends WeatherDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
  style: any;
  className: string;
}

export default function ForecastWeatherDetail(
  props: ForecastWeatherDetailProps
) {
  const {
    weatherIcon = "02d",
    date = "19.09",
    day = "Tuesday",
    temp,
    feels_like,
    temp_min,
    temp_max,
    description,
    style,
    className
  } = props;
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.4,
  });

  const [hasAnimated, setHasAnimated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
      setHasAnimated(true);
    }
  }, [inView]);

  // Hide the component after it leaves the viewport, after some delay
  useEffect(() => {
    if (!inView && hasAnimated) {
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [inView, hasAnimated]);

  return (
    <Container
    ref={ref}
     className=
     {cn(
      "gap-4",
      props.className,
      isVisible ? "animate__animated animate__fadeIn animate__slow" : "animate__animated animate__fadeOut animate__slow",)}>
      {/* left */}
      <section className="flex gap-10 items-center pl-4">
        <div className=" flex flex-col gap-1 items-center rounded p-2 px-6 ml-2 my-2" style={style}>
          <WeatherIcon iconname={weatherIcon} />
          <p className="bg-gray-200/60 rounded p-1">{date}</p>
          <p className="text-sm bg-gray-200/60 rounded p-1">{day} </p>
        </div>

        {/*  */}
        <div className="flex flex-col px-4 mx-2 items-center text-center">
          <span className="text-5xl mb-2">{convertKelvinToCelsius(temp ?? 0)}°</span>
          <p className="text-sm space-x-1 whitespace-nowrap  my-2">
            <span> Feels like</span>
            <span>{convertKelvinToCelsius(feels_like ?? 0)}°</span>
          </p>
          <p className="text-sm space-x-2 w-full">
            <span> {convertKelvinToCelsius(temp_min ?? 0)}°↓{" "}</span>
             <span>{" "}{convertKelvinToCelsius(temp_max ?? 0)} °↑</span>
          </p>
          <p className="capitalize text-xs whitespace-nowrap mt-2"> {description}</p>
        </div>
      </section>
      {/* right */}
      <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
        <WeatherDetails {...props} />
      </section>
    </Container>
  );
}