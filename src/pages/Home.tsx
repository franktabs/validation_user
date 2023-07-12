import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler } from "react-hook-form"
import { Electeur } from '../models/Electeur';

export default function Home() {

    const {register, handleSubmit, formState: {errors}} = useForm<Electeur>()
    return (
        <div>
            <form>
                <TextField size='small'  id="outlined-basic" label="nom" variant="outlined" {...register("nom")} />
                <TextField size='small' id="outlined-basic" label="prenom" variant="outlined" {...register("prenom")} />
                <TextField size='small' type="date" id="outlined-basic" label="prenom" variant="outlined" {...register("Date_naissance")} />
                <div className=''>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                            <label  className="form-check-label" htmlFor="flexRadioDefault1">
                                Masculin
                            </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                Feminin
                            </label>
                    </div>
                </div>

            </form>
        </div>
    )
}
