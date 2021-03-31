import React from 'react'
import { CFooter, CLink } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <CLink to="/dashboard" target="_blank" rel="noopener noreferrer">Barokah Jamur Merang</CLink>
        <span className="ml-1">&copy; 2021</span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Barokah</span>
        <CLink to="/dashboard" target="_blank" rel="noopener noreferrer">Jamur Merang</CLink>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
