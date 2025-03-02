import React, { useState } from 'react';

const YearDropdown = ({onSelect, Name}) => {
  // Get the current year
  const currentYear = new Date().getFullYear();

  // Generate an array of years (e.g., from 1900 to the current year)
  const years = [];
  for (let year = 1900; year <= currentYear; year++) {
    years.push(year);
  }

  // Set the default value as the current year
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Handle the change in dropdown selection
  const handleChange = (event) => {
    setSelectedYear(event.target.value);
    console.log(typeof event.target.value);
    onSelect(event.target.value);
  };

  return (
    <div className='mb-0 basis-1/3 inline-block border rounded-md p-1'>
      <label htmlFor="year">{Name} </label>
      <select
        id="year"
        value={selectedYear}
        onChange={handleChange}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      {/*   <p>Selected Year: {selectedYear}</p> */}
    </div>
  );
};

export default YearDropdown;
