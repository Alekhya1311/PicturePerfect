import React from 'react'
import { Tab, Tabs } from '@mui/material'
import { FilterContext } from '../Post/post';

function Filters() {
    const {tabFilter, setTabFilter, setFilterClass} = React.useContext(FilterContext); 

    
    const handleChange = (e, newValue) => {
        setTabFilter(newValue);
        if(newValue === 'edit'){
          setFilterClass('');
        }
    }
  return (
    <div className=''>
        <Tabs style={{backgroundColor:'white'}} value={tabFilter} onChange={handleChange} textColor='primary' indicatorColor='secondary'>
            <Tab value="filter" label='Filters'/>
            <Tab value="edit" label='Edit'/>
        </Tabs>
    </div>
  )
}

export default Filters
