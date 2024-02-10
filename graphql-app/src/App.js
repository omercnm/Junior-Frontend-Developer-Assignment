import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import "./App.css";

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      continent {
        name
      }
    }
  }
`;

const App = () => {
  const [filterText, setFilterText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { loading, error, data } = useQuery(GET_COUNTRIES);

  useEffect(() => {
    if (data) {
      let selected;
      const filteredCountries = data.countries.filter((country) =>
        country.name.toLowerCase().includes(filterText.toLowerCase())
      );

      if (filteredCountries.length >= 10) {
        selected = filteredCountries[9];
      } else if (filteredCountries.length > 0) {
        selected = filteredCountries[filteredCountries.length - 1];
      }

      setSelectedItem(selected);
    }
  }, [data, filterText]);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterText(value);
  };

  const handleItemClick = (item) => {
    setSelectedItem((prevSelectedItem) =>
      prevSelectedItem && prevSelectedItem.code === item.code ? null : item
    );
  };

  let filteredCountries = [];
  if (data) {
    filteredCountries = data.countries.filter((country) =>
      country.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto max-w-screen-md">
      <div>
        <p className="header text-2xl text-blue-800 text-center font-bold mb-4">
          Country List
        </p>
      </div>
      <div className="filter-container mb-4">
        <input
          className="filter-input p-2 border border-gray-300 rounded w-full"
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={handleFilterChange}
        />
      </div>
      <ul className="country-list">
        {filteredCountries.map((country) => (
          <li
            key={country.code}
            onClick={() => handleItemClick(country)}
            className={`country-item flex items-center p-2 cursor-pointer border-b border-gray-300 ${
              selectedItem && selectedItem.code === country.code
                ? "bg-blue-100"
                : ""
            }`}
          >
            <span className="country-name font-bold">{country.name}</span> -{" "}
            <span>{country.continent.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
