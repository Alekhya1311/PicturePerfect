import React, { useContext, useEffect } from 'react';
import { Box,Slider } from '@mui/material';
import { useState } from 'react';
import { FilterContext } from '../Post/post';


const SliderField = ({slide}) => {
    const {label, defaultValue, field } = slide;
    const [value, setValue] = useState(defaultValue);
    
    const { customFilter, setCustomFilter}  = useContext(FilterContext);

    useEffect(() => {
      setCustomFilter({...customFilter, [field]:value})
    }, [value]);

    const handleSliderValue = e => setValue(e.target.value);
  return (
    <Box>
        <Box sx={{minWidth:'6rem'}}>{label} </Box>
        <Slider
        size = 'small'
        valueLabelDisplay="auto"
        value={value}
        
        onChange={handleSliderValue}
        max={200}
        />
    </Box>

  )
}

export default SliderField