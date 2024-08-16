import './App.css';
import React, { useState } from 'react';
import Papa from 'papaparse';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';

// Register the components with Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, ArcElement, LineElement, Title, Tooltip, Legend);

const aggregateTransactions = (transactions, minWithdrawal, minDeposit) => {
  const result = transactions.reduce((acc, tx) => {
    const { Counterparty, Amount } = tx;
    const amount = parseFloat(Amount);

    if (!acc[Counterparty]) {
      acc[Counterparty] = { withdrawals: 0, deposits: 0 };
    }

    if (amount < 0 && amount < minWithdrawal) {
      acc[Counterparty].withdrawals += amount;
    } else if (amount > 0 && amount > minDeposit) {
      acc[Counterparty].deposits += amount;
    }
    if (acc[Counterparty].withdrawals === 0 && acc[Counterparty].deposits === 0) {
      delete acc[Counterparty];
    }
    return acc;
  }, {});

  const labels = Object.keys(result);
  const withdrawals = labels.map(label => result[label].withdrawals);
  const deposits = labels.map(label => result[label].deposits);

  return { labels, withdrawals, deposits };
};

const BarChart = ({ transactions }) => {
  // Aggregate data
  const [minWithdrawal, setMinWithdrawal] = useState(-1000);
  const [minDeposit, setMinDeposit] = useState(1000);
  const { labels, withdrawals, deposits } = aggregateTransactions(transactions, minWithdrawal, minDeposit);

  // Prepare data for Chart.js
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Withdrawals',
        data: withdrawals,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Deposits',
        data: deposits,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Makes the chart horizontal
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw.toFixed(2)} PLN`;
          },
        },
      },
    },
  };

  return (
    <div className="add-margin" style={{width: '100%'}}>
      <h2>Transaction Amounts by Counterparty</h2>
      <div style={{display:'flex', flexDirection:'column'}}>
        <label>Min Withdraw Amount:</label>
        <input className="label-input" type="number" value={minWithdrawal} onChange={(event) => setMinWithdrawal(event.target.value)} />
      </div>
      <div style={{display:'flex', flexDirection:'column'}}>
        <label>Min Deposit Amount:</label>
        <input className="label-input" type="number" value={minDeposit} onChange={(event) => setMinDeposit(event.target.value)} />
      </div>
      <Bar width={1500} height={1000} data={data} options={options} />
    </div>
  );
};

const AggregatePieChart = ({ transactions }) => {
  const [minAmount, setMinAmount] = useState(-1000);
  // Aggregate amounts by counterparty
  const counterpartyTotals = {};

  transactions.forEach(transaction => {
    const amount = parseFloat(transaction.Amount);
    const counterparty = transaction.Counterparty.trim();

    if (!counterpartyTotals[counterparty]) {
      counterpartyTotals[counterparty] = 0;
    }

    // Accumulate the amounts
    counterpartyTotals[counterparty] += amount;
  });

  // Separate the amounts taken out and put in
  const counterpartyNames = [];
  const withdrawalAmounts = [];

  for (const counterparty in counterpartyTotals) {
    const netWithdrawal = counterpartyTotals[counterparty];
    if ( minAmount < 0 && netWithdrawal < minAmount) {
      counterpartyNames.push(counterparty);
      withdrawalAmounts.push(netWithdrawal);
    } else if (minAmount >= 0 && netWithdrawal > minAmount) {
      counterpartyNames.push(counterparty);
      withdrawalAmounts.push(netWithdrawal);
    }
  }

  const data = {
    labels: counterpartyNames,
    datasets: [
      {
        label: 'Culminated Amount to Counterparty',
        data: withdrawalAmounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="add-margin">
      <h3>Culminated Amount to Counterparty (PLN)</h3>
      <div style={{display:'flex', flexDirection:'column'}}>
        <label>Min Amount:</label>
        <input className="label-input" type="number" value={minAmount} onChange={(event) => setMinAmount(event.target.value)} />
      </div>
      <Pie width={1000} data={data} />
    </div>
  );
};

const BalanceChart = ({ transactions }) => {
  // Prepare the data for the line chart
  const labels = transactions.map(transaction => transaction.TransactionDate);
  const dataPoints = transactions.map(transaction => parseFloat(transaction.Balance));

  const data = {
    labels,
    datasets: [
      {
        label: 'Balance Over Time',
        data: dataPoints,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Transaction Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Balance (PLN)',
        },
      },
    },
  };

  return (
    <div style={{width: '100%'}} className="add-margin">
      <h3>Balance Over Time (PLN)</h3>
      <Line data={data} options={options} />
    </div>
  );
};


const TransactionList = ({ transactions }) => {
  return (
    <div style={{fontSize: '12px', width: '50%'}} className="add-margin">
      <h3>Transaction List</h3>
      <ul style={{listStyle: 'none'}}>
        {transactions.map((transaction, index) => (
          <li key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <strong>TXN Date:</strong> {transaction.TransactionDate} <br />
            <strong>Counterparty:</strong> {transaction.Counterparty} <br />
            <strong>Title:</strong> {transaction.Title} <br />
            <strong>Account Number:</strong> {transaction.AccountNumber} <br />
            <strong style={{ color: transaction.Amount[0] === '-' ? 'red' : 'green' }}>Amount:</strong> {transaction.Amount} {transaction.Currency} <br />
            <strong>Balance:</strong> {transaction.Balance} {transaction.Currency} <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

function parseTransactionData(transactions) {
  return transactions
    .filter(transaction => transaction["_6"] && transaction["_6"].trim() !== "")
    .map(transaction => ({
      TransactionDate: transaction["List of transactions"],
      Counterparty: transaction["_1"],
      Title: transaction["_2"],
      AccountNumber: transaction["_3"],
      Amount: transaction["_6"].replace(",", "."),
      Currency: transaction["_7"],
      Balance: transaction["_12"].replace(",", ".")
    }))
}

const TransactionUploader = () => {
  const [transactions, setTransactions] = useState([]);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedData = (parseTransactionData(results.data)).slice(1)
        setTransactions(parsedData);
      },
      skipEmptyLines: true,
    });
  };

  return (
    <div>
      <h2>Upload Transaction CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {transactions.length > 0 && (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <BalanceChart transactions={transactions} />
          <AggregatePieChart transactions={transactions} />
          <BarChart transactions={transactions} />
          <TransactionList transactions={transactions} />
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TransactionUploader />
      </header>
    </div>
  );
}

export default App;
