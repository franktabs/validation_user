import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler } from "react-hook-form"
import { Electeur, TypeElecteur } from '../models/Electeur';
import { FormControl, Input, InputAdornment, InputLabel } from '@mui/material';
import "./home.css"
import { useCallback, useEffect, useMemo, useState, MouseEvent } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable/DataTable';
import StyledHome from './StyledHome';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import ConfirmationModal from '../components/Modal/ConfirmationModal';
import { blockLoadElecteurs, loadElecteurs } from '../redux/loadDataElecteurSlice';
import $ from "jquery"
import { loadFormData } from '../redux/electeurSlice';
import UserModal from '../components/Modal/UserModal';
import { gererUtilisateur } from '../redux/utilisateurSlice';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { MyPDF } from '../components/pdf/MyPdf';
import { MyDocument } from '../components/pdf/MyDocument';
import styled from 'styled-components';


const BtnPdf = styled.div`
    a {
        display: block;
        text-decoration: none;
        color: white;
    }
`


export default function Home() {


    const userAuth = useAppSelector((state) => state.utilisateur);
    const allElecteurSelector = useAppSelector((state)=>state.electeur);
    const queryClient = useQueryClient()
    const loadDataElecteurSelector = useAppSelector((state) => state.loadDataElecteurs);
    const electeurSelector = useAppSelector((state) => state.electeur);
    const [queryDataElecteur, setQueryDataElecteur] = useState<TypeElecteur[]>([])
    const dispatch = useAppDispatch();

    const [allElecteur, setAllElecteur] = useState<TypeElecteur[]>([]);

    const queryElecteur = useQuery({
        queryKey: ["electeurs"], enabled: loadDataElecteurSelector.value, queryFn: async () => {
            let data = await Electeur.getAllLimit();
            console.log("first data home =>", data);
            if (data.length) {
                dispatch(blockLoadElecteurs());
                setQueryDataElecteur(data);
                return data
            } else {
                throw new Error("Impossible de recuperer les données")
            }
        }
    }
    );

    const handleCliceAllElecteur = useCallback(async () => {
        if(allElecteur.length===0){
            let allData = await Electeur.getAllData();
        setAllElecteur(allData)
        }
    }, [allElecteur])


    const { register, getValues, reset, handleSubmit, formState: { errors } } = useForm<TypeElecteur>({ defaultValues: Electeur.clearData });


    useEffect(() => {
        if (electeurSelector.putForm && electeurSelector.electeur) {
            dispatch(loadFormData(false))
            console.log("affichage de l'electeur", electeurSelector.electeur)
            reset(electeurSelector.electeur);
        }
    }, [electeurSelector.putForm, dispatch, electeurSelector.electeur, reset])


    console.log("ici =>", getValues())

    const handleClick: SubmitHandler<TypeElecteur> = useCallback(async (data) => {
        let electeur = new Electeur(data);
        $(".my-loader").removeClass("d-none")

        if (data.id && data.id != "-1") {
            await Electeur.update(data);
            queryClient.invalidateQueries({ queryKey: ["electeurs"] });
            dispatch(loadElecteurs());
            reset(Electeur.clearData);
        }
        else if ((await electeur.save())) {
            queryClient.invalidateQueries({ queryKey: ["electeurs"] });
            dispatch(loadElecteurs());
            reset(Electeur.clearData);
        }
        $(".my-loader").addClass("d-none")


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
                    col.push({ field: attr, headerName: "Date de Naissance", minWidth: 180 })
                }
                else if (attr === "bureau_vote") {
                    col.push({ field: attr, headerName: "Bureau de Vote", minWidth: 150 })
                }
                else if (attr === "valider") {
                    col.push({ field: attr, headerName: "A Voté", minWidth: 150 })
                }
                else {
                    col.push({ field: attr, headerName: attr });

                }
            }

        }
        return col;
    }, [])

    const focusTextField = useCallback((name: keyof TypeElecteur) => {
        if (getValues(name)) {
            return { focused: true }
        }

    }, [getValues]);

    const checkedRadio = useCallback((value: TypeElecteur["sexe"]) => {
        if (getValues("sexe") == value) {
            return { defaultChecked: true }
        } else {
            return { defaultChecked: false }
        }

    }, [getValues]);

    const handlePassword = useCallback((value: MouseEvent) => {
        $(".user-modal").removeClass("d-none");
        dispatch(gererUtilisateur({ ...userAuth, gerer: true }));
        console.log("affiche usemodal")
    }, [dispatch, userAuth])

    const formatDate = useCallback(() => {
        let date = getValues("date_naissance");
        if (typeof date == "string") {
            let tabDate = date.split("/");
            if (tabDate[2]) {
                let jour = tabDate[0];
                console.log('jour', jour)
                let mois = tabDate[1];
                console.log('mois', mois)
                let annee = tabDate[2];
                console.log('annee', annee)
                let formatage = annee + "-" + mois + "-" + jour;
                console.log("la date est ", formatage)
                return { value: formatage }
            }

        }
    }, [getValues])

    formatDate()

    console.log("render Home");
    return (

        <>
            <ConfirmationModal />
            <UserModal />
            <h1 className=' text-center mt-2' > ENREGISTREMENT DU PERSONNEL</h1>
            <StyledHome className=' d-flex px-2 p-md-5'>
                <div className=' p-2 p-md-3 my-form'>
                    <form>
                        <div className=' d-flex flex-column gap-3'>
                            <TextField error={!!errors.nom} helperText={errors.nom?.message ?? ""} size='small' label="Nom" variant="outlined" defaultValue={"frank"} {...register("nom", { required: "Ce champs est requis" })} required {...focusTextField("nom")} />
                            <TextField size='small' label="Prenom" variant="outlined" {...register("prenom")} {...focusTextField("prenom")} />

                            <div>
                                <InputLabel htmlFor="standard-adornment-date" >
                                    Date de naissance
                                </InputLabel>
                                <TextField error={!!errors.date_naissance} fullWidth={true} {...formatDate()} helperText={errors.date_naissance?.message ?? ""} size='small' type="date" id="standard-adornment-date" variant="outlined" {...register("date_naissance", { required: "Ce champs est requis" })}  {...focusTextField("date_naissance")} required />

                            </div>
                            <div className=' d-flex gap-3'>
                                <InputLabel htmlFor="standard-adornment-amount">Sexe</InputLabel>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" {...register("sexe", { required: "Ce Champs est requis" })} id="flexRadioDefault1" value={"M"} {...checkedRadio("M")} />
                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                        Masculin
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" {...register("sexe", { required: "Ce Champs est requis" })} id="flexRadioDefault2" value={"F"} {...checkedRadio("F")} />
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
                            <TextField size='small' label="Residence" variant="outlined" {...register("residence")}  {...focusTextField("residence")} />
                            <TextField size='small' label="Adresse 1" variant="outlined" {...register("adresse1")}  {...focusTextField("adresse1")} />
                            <TextField size='small' label="Adresse 2" variant="outlined" {...register("adresse2")} {...focusTextField("adresse2")} />
                            <TextField size='small' label="Bureau de Vote" variant="outlined" {...register("bureau_vote")} {...focusTextField("bureau_vote")} />
                            <TextField size='small' label="Leader" variant="outlined" {...register("leader")} {...focusTextField("leader")} />

                        </div>
                        <div className=' pt-3 d-flex justify-content-end gap-2'>
                            <button className=' btn btn-success' onClick={handleSubmit(handleClick)} > Enregistrer </button>
                            <button className=' btn btn-dark' onClick={() => { reset(Electeur.clearData) }} > Reset </button>
                        </div>
                    </form>
                </div>
                <div>
                    <p className='fs-2 text-center'>
                        Nombre total d'électeurs enregistrés: {Electeur.totalElecteur || "aucun trouvé"}
                    </p>
                    <p className='fs-2 text-center'>
                        Nombre d'électeurs filtrés : {Electeur.countLastRequest || "aucun"}
                    </p>
                    {
                        userAuth.value.type === "admin" ?
                            <div className=' p-4 d-flex justify-content-between flex-wrap gap-3'>
                                <button className='btn btn-primary' onClick={handlePassword} >Gestion Mots de passes</button>
                                <BtnPdf className='btn btn-dark'  >
                                   
                                        <PDFDownloadLink document={<MyDocument nameCol={columns as any} rows={allElecteurSelector.allDataElecteur || []} />} fileName="tableau.pdf">
                                            {({ blob, url, loading, error }) =>
                                                loading ? 'Chargement du PDF...' : 'Télécharger le PDF'
                                            }
                                        </PDFDownloadLink>
                                   

                                </BtnPdf>
                            </div> : null
                    }

                    <DataTable columns={columns} rows={queryDataElecteur ?? []} loading={queryElecteur.status === "loading"} error={queryElecteur.status === "error"} reset={reset} />
                </div>
            </StyledHome>
        </>
    )
}
