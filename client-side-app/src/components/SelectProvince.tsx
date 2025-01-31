import { Typography, Select, MenuItem, FormControl } from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

type Props = {
  province: string;
  setProvince: React.Dispatch<React.SetStateAction<string>>;
};


const ProvinceSelector: React.FC<Props> =  ({ province, setProvince }) => {

  const provinces = [
  'กระบี่', 'กรุงเทพมหานคร', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร',
    'ขอนแก่น',
    'จันทบุรี',
    'ฉะเชิงเทรา',
    'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่',
    'ตรัง', 'ตราด', 'ตาก',
    'นครนายก', 'นครปฐม', 'นครพนม', 'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 'น่าน',
    'บึงกาฬ', 'บุรีรัมย์',
    'ปทุมธานี', 'ประจวบคีรีขันธ์', 'ปราจีนบุรี', 'ปัตตานี',
    'พระนครศรีอยุธยา', 'พะเยา', 'พังงา', 'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่',
    'ภูเก็ต',
    'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน',
    'ยโสธร', 'ยะลา',
    'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 'ราชบุรี',
    'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย',
    'ศรีสะเกษ',
    'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ', 'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์',
    'หนองคาย', 'หนองบัวลำภู',
    'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี'
]



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
