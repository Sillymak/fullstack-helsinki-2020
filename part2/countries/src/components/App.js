import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({filter, handler}) => {
  return (
    <div>find countries <input value={filter} onChange={handler} /></div>
  )
}

const CountryDetail = ({country}) => {
  const [ weather, setWeather ] = useState({
    temp: null,
    icon: null,
    wind: null
  })

  const hook = () => {
    const params = {
      access_key: process.env.REACT_APP_API_KEY,
      query: country.capital.replace(/[.]/g,'').replace(',',''),
      units: 'f'
    }
    axios.get('http://api.weatherstack.com:80/current', {params})
      .then(response =>{
        const data = response.data
        setWeather({
          temp: data.current.temperature,
          icon: data.current.weather_icons[0],
          wind: `${data.current.wind_speed} mph direction ${data.current.wind_dir}`
        })
      }).catch(error => {
        console.log(error)
      })
  }

  useEffect(hook, [])

  return (
  <>
    <h2>{country.name}</h2>
    <div>capital {country.capital}</div>
    <div>population {country.population.toLocaleString()}</div>
    <h2>languages</h2>
    <ul>
      {country.languages.map((language,i) =>
        <li key={i}>{language.name}</li> 
      )}
    </ul>
    <div><img alt={`${country.name} flag`} src={`${country.flag}`} width='150' /></div>
    <h2>Weather in {country.capital}</h2>
    <div><strong>temperature:</strong> {weather.temp} F</div>
    <div><img alt='weather icon' src={`${weather.icon}`} /></div>
    <div><strong>wind: </strong>{weather.wind}</div>
  </>
  )
}

const CountryList = ({countries, handler}) => {
  if (countries.length > 10) {
    return 'Too many matches, specify another filter'
  } 
  
  if (countries.length === 1) {
    return (
      <>
      {countries.map((country,i) => 
        <CountryDetail key={i} country={country} />
      )}
      </>
    )
  }

  if (countries.length <= 10) {
    return (
      <>
      {countries.map((country,i) => 
        <div key={i}>{country.name} <input type="button" value='show' onClick={() => handler(country.name)} /></div>
      )}
      </>
    )
  }
}

const App = () => {
  const [ filter, setFilter ] = useState('')
  const [ countries, setCountries ] = useState([])

  const hook = () => {
    axios.get('https://restcountries.eu/rest/v2/all')
    .then(response => {
      setCountries(response.data)
    })
  }

  useEffect(hook, [])

  const handleSearchFilter = (event) => {
    setFilter(event.target.value)
  }

  const filteredCountries = filter
    ? countries.filter(country => country.name.toLowerCase().indexOf(filter.toLowerCase()) > -1)
    : countries

  return (
    <>
    <Filter text={filter} handler={handleSearchFilter} />
    <CountryList countries={filteredCountries} handler={setFilter} />
    </>
  )
}


export default App