import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler } from "react-hook-form"
import { Electeur, TypeElecteur } from '../models/Electeur';
import { FormControl, Input, InputAdornment, InputLabel } from '@mui/material';
import "./home.css"
import { useCallback, useMemo, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable/DataTable';
import StyledHome from './StyledHome';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import ConfirmationModal from '../components/Modal/ConfirmationModal';
import { blockLoadElecteurs, loadElecteurs } from '../redux/loadDataElecteurSlice';

export default function Home() {


    const queryClient = useQueryClient()
    const loadDataElecteurSelector = useAppSelector((state) => state.loadDataElecteurs);
    const dispatch = useAppDispatch();

    const queryElecteur = useQuery({
        queryKey: ["electeurs"], enabled: loadDataElecteurSelector.value, queryFn: async () => {
            let data = await Electeur.getAll();
            if (data.length) {
                dispatch(blockLoadElecteurs())
                return data
            } else {
                throw new Error("Impossible de recuperer les données")
            }
        }
    }
    );


    const { register, reset, handleSubmit, formState: { errors } } = useForm<TypeElecteur>();


    const handleClick: SubmitHandler<TypeElecteur> = useCallback(async (data) => {
        let electeur = new Electeur(data);
        if ((await electeur.save())) {
            queryClient.invalidateQueries({ queryKey: ["electeurs"] });
            dispatch(loadElecteurs());
            reset();
        }

    }, [dispatch, queryClient, reset])
    const columns = useMemo(() => {
        let col: GridColDef[] = []
        let attr: keyof TypeElecteur
        for (attr in Electeur.clearData) {
            if (attr !== "id") {
                if (attr === "nom" || attr === "prenom") {
                    col.push({ field: attr, headerName: attr, minWidth: 180 })
                }
                else if (attr === "date_naissance") {
                    col.push({ field: attr, headerName: "Date de Naissance", minWidth: 150 })
                }
                else if (attr === "bureau_vote") {
                    col.push({ field: attr, headerName: "Bureau de Vote", minWidth: 150 })
                }
                else {
                    col.push({ field: attr, headerName: attr });

                }
            }

        }
        return col;
    }, [])




    return (

        <>
            <ConfirmationModal />
            <h1 className=' text-center mt-2' > ENREGISTREMENT DU PERSONNEL</h1>
            <StyledHome className=' d-flex p-2 p-md-5'>
                <div className=' p-2 p-md-3 my-form'>
                    <form>
                        <div className=' d-flex flex-column gap-3'>
                            <TextField error={!!errors.nom} helperText={errors.nom?.message ?? ""} size='small' id="outlined-basic" label="Nom" variant="outlined" {...register("nom", { required: "Ce champs est requis" })} required />
                            <TextField size='small' id="outlined-basic" label="Prenom" variant="outlined" {...register("prenom")} />

                            <div>
                                <InputLabel htmlFor="standard-adornment-date" >
                                    Date de naissance
                                </InputLabel>
                                <TextField error={!!errors.date_naissance} fullWidth={true} helperText={errors.date_naissance?.message ?? ""} size='small' type="date" id="standard-adornment-date" variant="outlined" {...register("date_naissance", { required: "Ce champs est requis" })} required />

                            </div>
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
                    <DataTable columns={columns} rows={queryElecteur.data ?? []} loading={queryElecteur.status === "loading"} error={queryElecteur.status === "error"} />
                </div>
            </StyledHome>
        </>
    )
}
