import { atom } from "jotai";

export const placeAtom = atom({
    city: "London",
    coordinates: {
      lat: 51.5074,
      lon: -0.1278,
    },
  });

export const loadingCityAtom = atom(false);