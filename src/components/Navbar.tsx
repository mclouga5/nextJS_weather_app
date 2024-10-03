'use client';

import React from 'react';
import { GiStripedSun } from "react-icons/gi";
import { MdMyLocation, MdLocationPin } from 'react-icons/md';
import SearchBox from './SearchBox';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from '@/app/atom';
import 'animate.css';

type Props = { location?: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

interface CitySuggestion {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  //
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );
        const suggestions = response.data.list.map((item: any) => ({
          name: item.name,
          country: item.sys.country,
          lat: item.coord.lat,
          lon: item.coord.lon,
        }));
        setSuggestions(suggestions);
        setError('');
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(suggestion: CitySuggestion) {
    setLoadingCity(true);
    setTimeout(() => {
      setLoadingCity(false);
      setCity(`${suggestion.name}, ${suggestion.country}`);
      setPlace({
        city: suggestion.name,
        coordinates: {
          lat: suggestion.lat,
          lon: suggestion.lon,
        },
      });
      setShowSuggestions(false);
    }, 1000);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault();
    if (suggestions.length == 0) {
      setError('Location not found');
      setLoadingCity(false);
    } else {
      setError('');
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(
          {city: place.city,
          coordinates:
          {lat: place.coordinates.lat,
          lon: place.coordinates.lon
          }
        });
        setShowSuggestions(false);
      }, 500);
    }
  }

  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (postiion) => {
        const { latitude, longitude } = postiion.coords;
        try {
          setLoadingCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(
              {city: response.data.name,
              coordinates:
              {lat: response.data.coord.lat,
                lon: response.data.coord.lon
              }
            });
          }, 1000);
        } catch (error) {
          setLoadingCity(false);
        }
      });
    }
  }

  return (
    <>
      <nav className='shadow-sm  sticky top-0 left-0 z-50 bg-white'>
        <div className='h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto'>
          <div className='flex items-end gap-2'>
          <h2 className='flex items-center justify-center gap-2  '>
            <p className='text-gray-500 text-3xl'>Weather</p>
            <GiStripedSun className='text-3xl mt-1 text-amber-300' />
          </h2>
          <p className='text-xs mb-1 text-gray-600 font-serif animate__animated animate__bounce animate__slow'>By Aoife</p>
          </div>

          <section className='flex gap-4 items-center'>
            <MdMyLocation
              title='Current Location (may take a few seconds)'
              onClick={handleCurrentLocation}
              className='text-2xl text-gray-500 hover:opacity-80 cursor-pointer'
            />
            <div className='flex items-center'>
              <MdLocationPin className='text-3xl text-gray-600' />
              <p className='text-slate-900/80 text-sm mt-1'> {location} </p>
            </div>
            <div className='relative hidden md:flex'>

              {/* SearchBox */}
              <SearchBox
                value={city}
                onSubmit={handleSubmitSearch}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <SuggetionBox
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error
                }}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className='flex   max-w-7xl px-3 md:hidden '>
        <div className='relative '>
          {/* SearchBox */}

          <SearchBox
            value={city}
            onSubmit={handleSubmitSearch}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <SuggetionBox
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error
            }}
          />
        </div>
      </section>
    </>
  );
}

function SuggetionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error
}: {
  showSuggestions: boolean;
  suggestions: CitySuggestion[];
  handleSuggestionClick: (item: CitySuggestion) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className='mb-4 bg-white absolute border top-[44px] left-0 border-gray-300
        rounded-md min-w-[200px]  flex flex-col gap-1 py-2 px-2 z-50 overflow-auto'>
          {error && suggestions.length < 1 && (
            <li className='text-red-500 p-1 '> {error}</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className='cursor-pointer p-1 rounded   hover:bg-gray-200'
            >
             {item.name}, {item.country}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}


