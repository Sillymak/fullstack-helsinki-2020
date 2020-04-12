import React from 'react'

const Header = ({text}) => {
  return <h2>{text}</h2>
}

const Part = ({part}) => {
  return (
    <>
    <p>{part.name} {part.exercises}</p>
    </>
  )
}

const Content = ({parts}) => {
  return (
    <>
    {parts.map(part => 
      <Part key={part.id} part={part} />
    )}
    </>
  )
}

const Total = ({parts}) => {
  const total = parts.reduce((s, p) => s + p.exercises, 0)

  return (
    <strong>total of {total} exercises</strong>
  )
}

const Course = ({courses}) =>{
  return (
    <>
    {courses.map(course =>
      <div key={course.id}>
        <Header text={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )}
    </>
  )
}

export default Course