import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { padding } from '@mui/system'
import React, { useContext} from 'react'
import { FilterContext } from '../Post/post'
import { filterValues } from '../utils/effects'

function FilterEffect() {

    const {filterClass, setFilterClass} = useContext(FilterContext);
    const handleChange = (e) =>  setFilterClass(e.target.value);
  return (
    <Box>
        <FormControl  fullWidth style={{color:"white"}}>
            <InputLabel>Filters</InputLabel>
            <Select className='options' style={{backgroundColor:'white'} }
            onChange={handleChange}
            value={filterClass}
            label="Filter">
                {filterValues.map(filter => <MenuItem value={filter.class} key={filter.class }>{filter.name}</MenuItem>)}
            </Select>
        </FormControl>
    </Box>
  )
}

export default FilterEffect