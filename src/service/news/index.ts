import { NewsResponse } from "@entities/News";
import { config } from "@config/config";
import axios from "axios";

export const getEveryNews = async (tema: string): Promise<NewsResponse> => {
  const response = await axios.get(
    `https://newsapi.org/v2/everything?q=${tema}&apiKey=${config.NEWS_KEY}`
  );

  return response.data;
};

export const getTopNews = async (
  tema: string = "",
  country: string = "us",
  category: string = "",
  source: string = ""
): Promise<NewsResponse> => {
  if (category) {
    category = `&category=${category}`;
  }

  if (source) {
    source = `&sources=${source}`;
  }

  if (country) {
    country = `country=${country}`;
  }

  if (tema) {
    tema = `&q=${tema}`;
  }

  const response = await axios.get(
    `https://newsapi.org/v2/top-headlines?${country}${tema}${category}${source}&apiKey=${config.NEWS_KEY}`
  );

  return response.data;
};
