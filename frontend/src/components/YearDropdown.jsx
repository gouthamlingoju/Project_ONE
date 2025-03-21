import React, { useState } from 'react';
import Select from 'react-select';

const YearDropdown = ({ onSelect, Name }) => {
  // Get the current year
  const currentYear = new Date().getFullYear();

  // Generate an array of years (e.g., from 1999 to the current year)
  const years = [];
  for (let year = 1999; year <= currentYear; year++) {
    years.push({ value: year, label: year });
  }

  // Set the default value as the current year
  const [selectedYear, setSelectedYear] = useState({ value: currentYear, label: currentYear });

  // Handle the change in dropdown selection
  const handleChange = (selectedOption) => {
    setSelectedYear(selectedOption);
    onSelect(selectedOption.value);
  };

  return (
    <div className="mb-0 basis-1/3 inline-block border rounded-md p-1">
      <label htmlFor="year">{Name} </label>
      <Select
        value={selectedYear}
        onChange={handleChange}
        options={years}
        className="react-select-container"
        classNamePrefix="react-select"
        styles={{
          menu: (provided) => ({
            ...provided,
            maxHeight: 200, // limits the height of the dropdown to 5 items
            overflowY: 'auto',
          }),
        }}
      />
    </div>
  );
};

export default YearDropdown;
