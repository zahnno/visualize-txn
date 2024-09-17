# Transaction Visualizer

Transaction Visualizer is a React-based web application that helps users visualize financial transactions by providing multiple graph types (line, pie, and bar charts). It allows CSV file uploads, parses the transactions, and offers insights into withdrawals, deposits, and account balances over time. The app also includes filtering options to view specific transactions based on dates and counterparties.

## Features

- **CSV Upload:** Easily upload transaction data from CSV files for visualization.
- **Data Visualization:**
  - **Line Chart:** Tracks account balance over time.
  - **Pie Chart:** Aggregates transaction amounts by counterparty.
  - **Bar Chart:** Displays withdrawals and deposits by counterparty.
- **Transaction List:** A detailed list of transactions, with filters for counterparties and date range.
- **Filtering Options:** Filter transactions based on custom date ranges and minimum withdrawal/deposit amounts.
  
## Technologies Used

- **React:** Frontend framework for building the user interface.
- **Chart.js:** Used for rendering interactive charts (line, pie, bar).
- **PapaParse:** CSV parser to handle file uploads and data parsing.
- **React DatePicker:** For date range filtering of transactions.
- **CSS:** For basic styling.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/transaction-visualizer.git
   cd transaction-visualizer
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Upload CSV:**
   Upload a CSV file containing transaction data. The file should include at least the following columns:
   - `TransactionDate`: Date of the transaction.
   - `Counterparty`: The entity involved in the transaction.
   - `Amount`: The transaction amount.
   - `Balance`: Account balance after the transaction.
   - `Currency`: The currency in which the transaction was conducted.

2. **Filter Transactions:**
   - You can filter transactions by date range using the date picker.
   - Adjust the minimum withdrawal and deposit amounts for the bar chart using the input fields.

3. **View Charts:**
   - **Line Chart:** Shows account balance over time.
   - **Pie Chart:** Displays the accumulated transaction amounts by counterparty.
   - **Bar Chart:** Visualizes withdrawals and deposits by counterparty with adjustable minimum amounts.

4. **Transaction List:**
   View a filtered list of transactions, with details like the transaction date, counterparty, amount, balance, and account number.

## CSV Format Example

```csv
TransactionDate,Counterparty,Title,AccountNumber,Amount,Currency,Balance
2024-01-01,Account A,Payment,123456,-500,PLN,4500
2024-01-02,Account B,Deposit,654321,2000,PLN,6500
```

## Roadmap

- Add more chart types and transaction filters.
- Implement currency conversion for multi-currency transactions.
- Introduce user authentication for personalized data management.
- Enhance performance with large datasets.

## Contributing

Feel free to contribute by opening issues or submitting pull requests.

---

This README reflects the use of libraries like `PapaParse` for CSV parsing, `Chart.js` for visualizations, and React components for managing state and UI elements. Let me know if you need any further customization!
