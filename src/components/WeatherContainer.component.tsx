import { useEffect, useState } from "react";
import axios from "axios";
import { WiThermometer, WiThermometerExterior } from "react-icons/wi";
import { CiDroplet } from "react-icons/ci";
import { PiWind } from "react-icons/pi";

import "./WeatherContainer.sass";

const api_KEY: string = "f8252c6502aa981f405cd07731d6e052";

function WeatherContainer() {
  const [lat, setLat] = useState<number>();
  const [lon, setLon] = useState<number>();

  const [temp, setTemp] = useState<number>();
  const [humidity, setHumidity] = useState<number>();
  const [wind, setWind] = useState<number>();

  const [imageURL, setImageURL] = useState<string>();

  const [weatherMsg, setWeatherMsg] = useState<string>();

  function getCoords() {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      }
    );
  }

  useEffect(() => {
    getCoords();
  }, []);

  function getWeather() {
    axios
      .get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          lat: lat,
          lon: lon,
          units: "metric",
          appid: api_KEY,
        },
      })
      .then((res) => {
        const desc: string = res.data.weather[0].description;

        switch (desc) {
          case "clear sky":
            setImageURL("images/sunny.png");
            break;
          case "few clouds":
            setImageURL("images/fclouds.png");
            break;
          case "scattered clouds":
            setImageURL("images/sclouds.png");
            break;
          case "broken clouds":
            setImageURL("images/bclouds.png");
            break;
          case "shower rain":
            setImageURL("images/srain.png");
            break;
          case "rain":
            setImageURL("images/rain.png");
            break;
          case "thunderstorm":
            setImageURL("images/thunderstorm.png");
            break;
          case "snow":
            setImageURL("images/snow.png");
            break;
        }

        setWeatherMsg(desc.charAt(0).toUpperCase() + desc.slice(1));
        setTemp(res.data.main.temp);
        setWind(res.data.wind.speed);
        setHumidity(res.data.main.humidity);
      });
  }

  return (
    <>
      <div className="weather-body">
        <h1 className="weather-title">ClimaticApp</h1>
        <h2 className="weather-subtitle">The weather is...</h2>
        <h3 className={weatherMsg ? "weather-desc" : ""}>{weatherMsg}</h3>
        <div className="weather-status">
          <img src={imageURL ? imageURL : "images/sunny.png"} />
          {!lat! && !lon! ? (
            <button className="weather-btn" onClick={getCoords}>
              Get your local
            </button>
          ) : temp && wind && humidity ? (
            <>
              <h3 className="weather-info" id="weather-temp">
                Temperature: {temp.toFixed(1)}ºC{" "}
                {temp >= 20 ? <WiThermometer /> : <WiThermometerExterior />}
              </h3>
              <h3 className="weather-info" id="weather-hum">
                Humidity: {humidity}% <CiDroplet />
              </h3>
              <h3 className="weather-info" id="weather-wind">
                Wind Speed: {wind.toFixed(1)}m/s <PiWind />
              </h3>
            </>
          ) : (
            <button className="weather-btn" onClick={getWeather}>
              Get your weather
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default WeatherContainer;
