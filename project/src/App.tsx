import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, ChevronDown } from 'lucide-react';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const API_URL = import.meta.env.VITE_BACKEND_URL || "https://bajaj-project-umber.vercel.app/";

 
  useEffect(() => {
    if (response?.roll_number) {
      document.title = response.roll_number;
    }
  }, [response?.roll_number]);


  const validateAndParseJSON = (input) => {
    try {
      const parsed = JSON.parse(input);
      if (!parsed.data || !Array.isArray(parsed.data)) {
        throw new Error('Input must contain a "data" array');
      }
      return parsed;
    } catch (err) {
      throw new Error('Invalid JSON format');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const parsedData = validateAndParseJSON(jsonInput);
      
      const response = await fetch(`${API_URL}`, {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const renderFilteredData = () => {
    if (!response) return null;

    if (selectedFilters.length === 0) {
      return (
        <div className="space-y-2">
          <p><span className="font-semibold">User ID:</span> {response.user_id}</p>
          <p><span className="font-semibold">Email:</span> {response.email}</p>
          <p><span className="font-semibold">Roll Number:</span> {response.roll_number}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {selectedFilters.map((filter) => (
          <div key={filter} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold capitalize mb-2">{filter.replace('_', ' ')}:</h3>
            <div className="flex flex-wrap gap-2">
              {response[filter]?.length > 0 ? (
                response[filter].map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No data</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">API Data Processor</h1>
          
          <div className="flex flex-wrap gap-2">
            {['alphabets', 'numbers', 'highest_alphabet'].map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedFilters.includes(filter)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedFilters.includes(filter) && (
                  <Check className="mr-1.5 h-4 w-4" />
                )}
                {filter.replace('_', ' ')}
                <ChevronDown className="ml-1.5 h-4 w-4" />
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="json-input" className="block text-sm font-medium text-gray-700">
                JSON Input
              </label>
              <textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-32"
                placeholder='Provide Data Here'
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </form>

          {response && (
            <div className="mt-6">
              {renderFilteredData()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
