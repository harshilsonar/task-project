import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Fetch API
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.log(err));
  }, []);

  // Searching
  const searched = data.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // Filtering
  const filtered =
    filter === "All"
      ? searched
      : searched.filter((c) =>
          filter === "Top 10" ? c.market_cap_rank <= 10 : c.market_cap_rank > 10
        );

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.current_price - b.current_price;
    if (sort === "price-desc") return b.current_price - a.current_price;
    if (sort === "marketcap-asc") return a.market_cap - b.market_cap;
    if (sort === "marketcap-desc") return b.market_cap - a.market_cap;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / perPage);
  const start = (page - 1) * perPage;
  const pageData = sorted.slice(start, start + perPage);

  return (
    <div className="container">
      <h1 className="title">Crypto Market Tracker </h1>

      {/* Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder=" Search by name or symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Top 10</option>
          <option>Others</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="price-asc">Price Low → High</option>
          <option value="price-desc">Price High → Low</option>
          <option value="marketcap-asc">MarketCap Low → High</option>
          <option value="marketcap-desc">MarketCap High → Low</option>
        </select>
      </div>

      {/* Table */}
      <table className="crypto-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Price (USD)</th>
            <th>Market Cap</th>
            <th>24h Change</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((coin) => (
            <tr
              key={coin.id}
              className={
                coin.price_change_percentage_24h > 0 ? "positive" : "negative"
              }
            >
              <td>{coin.market_cap_rank}</td>
              <td className="coin-info">
                <img src={coin.image} alt={coin.name} />
                <div>
                  <div className="coin-name">{coin.name}</div>
                  <div className="coin-symbol">
                    {coin.symbol.toUpperCase()}
                  </div>
                </div>
              </td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td>${coin.market_cap.toLocaleString()}</td>
              <td>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => page > 1 && setPage(page - 1)} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => page < totalPages && setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
