import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({text}) => {
  return <h1>{text}</h1>
}

const Button = ({text, handleClick}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const App = (props) => {
  const header = 'Anecdote of the day'
  const headerTopAnecdote = 'Anecdote with the most votes'
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState ({
    array: new Array(6).fill(0),
    highest: 0
  })

  const nextAnecdote = () => {
    setSelected(Math.floor(Math.random() * 6))
  }

  const vote = () => {
    const newVotes = {...votes}
    newVotes.array[selected] += 1
    const highest = Math.max(...newVotes.array)
    const position = newVotes.array.indexOf(highest)
    newVotes.highest = position
    setVotes(newVotes)
  }

  return (
    <>
      <Header text={header} />
      {props.anecdotes[selected]}<br />
      has {votes.array[selected]} votes<br />
      <Button text='vote' handleClick={vote} />
      <Button text='next anecdote' handleClick={nextAnecdote} />
      <Header text={headerTopAnecdote} />
      {props.anecdotes[votes.highest]}
    </>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)