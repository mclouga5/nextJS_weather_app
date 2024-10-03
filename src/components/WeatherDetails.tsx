import React from "react";
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { MdAir } from "react-icons/md";
import { GiSunrise, GiSunset, GiSpeedometer, GiWindSlap } from "react-icons/gi";
import { BsFillDropletFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";

export interface WeatherDetailProps {
  visability: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}

export default function WeatherDetails(props: WeatherDetailProps) {
  const {
    visability = "50km",
    humidity = "50%",
    windSpeed = "50 km/h",
    airPressure = "1012 hPa",
    sunrise = "6.20",
    sunset = "18:50"
  } = props;

  return (
    <>
      <SingleWeatherDetail
        icon={<GiSunrise className="text-amber-400 text-4xl"/>}
        information="Sunrise"
        value={sunrise}
      />
      <SingleWeatherDetail
        icon={<GiSunset className="text-amber-400 text-4xl"/>}
        information="Sunset"
        value={sunset}
      />
      <SingleWeatherDetail
        icon={<FaEye />}
        information="Visability"
        value={visability}
      />
      <SingleWeatherDetail
        icon={<BsFillDropletFill />}
        information="Humidity"
        value={humidity}
      />
      <SingleWeatherDetail
        icon={<GiWindSlap />}
        information="Wind speed"
        value={windSpeed}
      />
      <SingleWeatherDetail
        icon={<GiSpeedometer />}
        information="Air Pressure"
        value={airPressure}
      />
    </>
  );
}

export interface SingleWeatherDetailProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-sm text-black/80 pl-4">
      <p className="whitespace-nowrap font-semibold">{props.information}</p>
      <div className="text-3xl">{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}