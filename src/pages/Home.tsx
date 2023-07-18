import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler } from "react-hook-form"
import { Electeur, TypeElecteur, dataTest} from '../models/Electeur';
import { FormControl, Input, InputAdornment, InputLabel } from '@mui/material';
import "./home.css"
import { useMemo } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';

export default function Home() {

    const { register, handleSubmit, formState: { errors } } = useForm<TypeElecteur>();
    const handleClick : SubmitHandler<TypeElecteur> = (data)=>{
        console.log("données=>", data);
    }
    const columns = useMemo(()=>{
        let col: GridColDef[] = []
        for(let attr in Electeur.clearData){
            col.push({field:attr, headerName:attr})
        }
        return col;
    },[])
    return (
        <div className=' d-flex'>
            <div className=' p-2 p-md-3 my-form'>
                <form>
                    <div className=' d-flex flex-column gap-3'>
                        <TextField size='small' id="outlined-basic" label="Nom" variant="outlined" {...register("nom")} />
                        <TextField size='small' id="outlined-basic" label="Prenom" variant="outlined" {...register("prenom")} />
                        <TextField size='small' type="date" id="outlined-basic" variant="outlined" {...register("date_naissance")} />
                        <div className=' d-flex gap-3'>
                            <InputLabel htmlFor="standard-adornment-amount">Sexe</InputLabel>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" {...register("sexe")} id="flexRadioDefault1" value={"M"} />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    Masculin
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" {...register("sexe")} id="flexRadioDefault2" value={"F"} />
                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                    Feminin
                                </label>
                            </div>
                        </div>
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-amount">Télephone</InputLabel>
                            <Input
                                id="standard-adornment-amount"
                                startAdornment={<InputAdornment position="start">+ 237</InputAdornment>}
                            />
                        </FormControl>
                        <TextField size='small' id="outlined-basic" label="Residence" variant="outlined" {...register("residence")} />
                        <TextField size='small' id="outlined-basic" label="bureau de vote" variant="outlined" {...register("bureau_vote")} />

                    </div>
                    <div className=' pt-3 text-end'>
                        <button className=' btn btn-primary' onClick={handleSubmit(handleClick)} > Enregistrer </button>
                    </div>
                </form>
            </div>
            <div>
                <DataTable columns={columns} rows={dataTest} />
            </div>
        </div>
    )
}
