import React from 'react';
import Container from "@/components/Container";
import scatteredClouds from '@/media/scatteredClouds.jpg';
import night from '@/media/night.jpg';
import heavyRain from '@/media/heavyRain.jpg';
import lightRain from '@/media/lightRain.png';
import sun from '@/media/sunny.jpg';
import overcastClouds from '@/media/overcastClouds.png';
import snow from '@/media/snow.jpg';

export const getBackgroundImage = (weatherMain: string, weatherDescription: string) => {
    switch (weatherMain) {
        case 'Clear':
          return sun;

        case 'Snow':
          return snow;

        case 'Rain':
          if (weatherDescription.includes('light')) return lightRain;
          if (weatherDescription.includes('heavy')) return heavyRain;
          return lightRain; // Default for other rain descriptions

        case 'Clouds':
          if (weatherDescription === 'scattered clouds') return scatteredClouds;
          if (weatherDescription === 'overcast clouds') return overcastClouds;
          return scatteredClouds; // Default for other cloud conditions

        default:
          return sun;
      }
};
