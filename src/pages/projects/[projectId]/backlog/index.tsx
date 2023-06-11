import React from 'react'
import Board from '../../../../layout/Board'

const Backlog = () => {
  return (
    <div>Backlog</div>
  )
}

Backlog.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Board>
      {page}
    </Board>
  )
}

export default Backlog