import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler } from "react-hook-form"
import { Electeur, TypeElecteur} from '../models/Electeur';
import { FormControl, Input, InputAdornment, InputLabel } from '@mui/material';
import "./home.css"
import { useMemo, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable/DataTable';
import StyledHome from './StyledHome';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from '../redux/hooks';
import { reloadElecteurs } from '../redux/electeurSlice';

export default function Home() {
    const dispatch = useAppDispatch()
    const [doQueryElecteur, setDoQueryElecteur] = useState<boolean>(true);
    const queryElecteur = useQuery({queryKey:["electeurs"],enabled:doQueryElecteur, queryFn: async ()=>{
        let data = await Electeur.getAll();
        if(data.length){
            setDoQueryElecteur(false)
            dispatch(reloadElecteurs(data))
            return data
        }else{
            throw new Error("Impossible de recuperer les données")
        }
    }}
    );


    const { register,reset, handleSubmit, formState: { errors } } = useForm<TypeElecteur>();
    const handleClick : SubmitHandler<TypeElecteur> = (data)=>{
        let electeur = new Electeur(data);
        electeur.save()
    }
    const columns = useMemo(()=>{
        let col: GridColDef[] = []
        let attr: keyof TypeElecteur
        for(attr in Electeur.clearData){
            if(attr!=="id"){
                if (attr === "nom" || attr === "prenom" ) {
                    col.push({ field: attr, headerName: attr, maxWidth: 100, flex:1 })
                }
                else if (attr === "date_naissance"){
                    col.push({ field: attr, headerName: "Date de Naissance", minWidth: 200 })
                }
                else{
                    col.push({ field: attr, headerName: attr });

                }
            } 
             
        }
        return col;
    },[])

    
    console.log(queryElecteur.data);
    return (
        
        <>
            <StyledHome className=' d-flex p-2 p-md-5'>
                <div className=' p-2 p-md-3 my-form'>
                    <form>
                        <div className=' d-flex flex-column gap-3'>
                            <TextField error={!!errors.nom} helperText={errors.nom?.message ?? ""} size='small' id="outlined-basic" label="Nom" variant="outlined" {...register("nom", { required: "Ce champs est requis" })} required />
                            <TextField size='small' id="outlined-basic" label="Prenom" variant="outlined" {...register("prenom")} />
                            <TextField error={!!errors.date_naissance} helperText={errors.date_naissance?.message ?? ""} size='small' type="date" id="outlined-basic" variant="outlined" {...register("date_naissance", { required: "Ce champs est requis" })} required />
                            <div className=' d-flex gap-3'>
                                <InputLabel htmlFor="standard-adornment-amount">Sexe</InputLabel>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" {...register("sexe")} id="flexRadioDefault1" value={"M"} defaultChecked />
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
                                    error={!!errors.tel}
                                    {...register('tel', {
                                        required: "Ce champs est requis", pattern: /^6\d{8}$/
                                    })}
                                    id="standard-adornment-amount"
                                    startAdornment={<InputAdornment position="start">+ 237</InputAdornment>}
                                />
                            </FormControl>
                            <TextField size='small' id="outlined-basic" label="Residence" variant="outlined" {...register("residence")} />
                            <TextField size='small' id="outlined-basic" label="bureau de vote" variant="outlined" {...register("bureau_vote")} />

                        </div>
                        <div className=' pt-3 d-flex justify-content-end gap-2'>
                            <button className=' btn btn-success' onClick={handleSubmit(handleClick)} > Enregistrer </button>
                            <button className=' btn btn-dark' onClick={() => { reset() }} > Reset </button>
                        </div>
                    </form>
                </div>
                <div>
                    <DataTable columns={columns} rows={queryElecteur.data??[]} loading={queryElecteur.status==="loading"} />
                </div>
            </StyledHome>
        </>
    )
}
