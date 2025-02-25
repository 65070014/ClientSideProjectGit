import { Typography, Select, MenuItem, FormControl } from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { provinces } from '../data/province';

type Props = {
  province: string;
  setProvince: React.Dispatch<React.SetStateAction<string>>;
};


const ProvinceSelector: React.FC<Props> =  ({ province, setProvince }) => {
  // Handle change event for province selection
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setProvince(event.target.value as string)
  }

  return (
    <div>
      <Typography variant="h4" align="center" className="mb-4">
        <FormControl variant="outlined" className="ml-2">
          <Select
            value={province}
            onChange={handleChange}
            displayEmpty
            IconComponent={ArrowDropDownIcon}
            inputProps={{
              'aria-label': 'Province selector'
            }}
          >
            {provinces.map((prov) => (
              <MenuItem key={prov} value={prov}>
                {prov}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Typography>
    </div>
  )
}

export default ProvinceSelector
