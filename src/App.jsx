import React, { useState, useEffect } from 'react'
import { Container } from '@mui/material'
import { Searcher } from './components/Searcher/Searcher'
import { UserCard } from './containers/UserCard/UserCard'
import { ThemeProvider } from '@emotion/react'
import { getUser } from './services/users'
import theme from './theme'

const containerStyle = {
  background: '#242629',
  width: {
    md: '80vw',
    xs: '90vw'
  },
  height: {
    sm: '30rem',
    xs: '100vh'
  },
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

function App () {
  const [inputUser, setInputUser] = useState('JMRodriguez-work')
  const [userState, setUserState] = useState(inputUser)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userResponse = await getUser(inputUser)
        if (userState === 'JMRodriguez-work') {
          window.localStorage.setItem('JMRodriguezwork', JSON.stringify(userResponse))
        }
        if (userResponse.message === 'Not Found') {
          const firstUser = JSON.parse(window.localStorage.getItem('JMRodriguezwork'))
          setInputUser(firstUser)
          setNotFound(true)
        } else if (userResponse.message?.slice(0, 3) === 'API') {
          setError('Something went wrong - API limit exceded for the hour')
        } else {
          setNotFound(false)
        }
        setUserState(userResponse)
      } catch (errorr) {
        setError('Something went wrong: ' + errorr)
        setUserState('JMRodriguez-work')
      }
    }
    fetchUsers()
  }, [inputUser])

  if (error) return <h1 style={{ color: '#D4E7E2' }}>{error}</h1>

  return (
    <ThemeProvider theme={theme}>
      <Container sx={containerStyle}>
        <Searcher notFound={notFound} setInputUser={setInputUser} />
        <UserCard notFound={notFound} userState={userState} />
      </Container>
    </ThemeProvider>
  )
}

export default App
