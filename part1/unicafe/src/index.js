import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({text}) => {
  return (
    <h1>{text}</h1>
    )
}

const Button = ({text, handleClick}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const Statistic = ({text, value, percent}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value} {percent}</td>
    </tr>
  )
}

const Statistics = ({totals}) => {
  if (totals.sum === 0) {
    return (
      <>
      No feedback given
      </>
    )
  }
  return (
    <>
    <table>
      <tbody>
        <Statistic text='good' value={totals.good} />
        <Statistic text='neutral' value={totals.neutral} />
        <Statistic text='bad' value={totals.bad} />
        <Statistic text='all' value={totals.sum} />
        <Statistic text='average' value={totals.score / totals.sum || 0} />
        <Statistic text='positive' value={totals.good * 100/ totals.sum || 0} percent='%' />
      </tbody>
    </table>
    </>
  )
}

const App = () => {
  const header = 'give feedback'
  const stats = 'statistics'
  const [totals, setTotals] = useState(
    {
      good: 0,
      neutral: 0,
      bad: 0,
      score: 0,
      sum: 0
    }
  )

  const handleGood = () => {
    setTotals({...totals, score: totals.score + 1, sum: totals.sum + 1, good: totals.good + 1})
  }

  const handleNeutral = () => {
    setTotals({...totals, sum: totals.sum + 1, neutral: totals.neutral + 1})
  }

  const handleBad = () => {
    setTotals({...totals, score: totals.score - 1, sum: totals.sum + 1, bad: totals.bad + 1})
  }

  return (
    <>
      <Header text={header} />
      <Button text='good' handleClick={handleGood} />
      <Button text='neutral' handleClick={handleNeutral} />
      <Button text='bad' handleClick={handleBad} />
      <Header text={stats} />
      <Statistics totals={totals} />
     </>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)