import { SubmitHandler, useForm } from "react-hook-form";
import { TypeElecteur } from "../models/Electeur";
import { TextField } from "@mui/material";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { CollectionReference, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { connected } from "../redux/connectedSlice";
import $ from "jquery"
import { gererUtilisateur } from "../redux/utilisateurSlice";
import { IUtilisateur } from "../models/Utilisateur";


type Admin = { nom: string, password: string }

export default function Login() {

    const dispatch = useAppDispatch();

    const { register, reset, handleSubmit, formState: { errors } } = useForm<Admin>();
 
    const handleClick: SubmitHandler<Admin> = useCallback(async (data) => {
        $(".my-loader").removeClass("d-none")
        let adminRef = collection(db, "admin") as CollectionReference<IUtilisateur>
        let adminSnapshot = await getDocs<IUtilisateur>(adminRef);
        let isConnected = false;
        let userAuth:IUtilisateur|null = null;
        adminSnapshot.forEach((doc)=>{
            let admins = doc.data();
            if(admins.nom ===data.nom.trim() && admins.password === data.password.trim()){
                userAuth = doc.data();
                userAuth.id = doc.id;
                isConnected = true;
            }
        })

        if(isConnected && userAuth ){
            dispatch(gererUtilisateur({value:userAuth, gerer:false}))
            dispatch(connected())
        }
        $(".my-loader").addClass("d-none")


    }, [dispatch])

    return (
        <>
            
            <div className=" d-flex justify-content-center align-items-center flex-column" >
                <h1 className=" pt-5">CONNEXION</h1>
                <div className=' p-2 p-md-3 my-form'>

                    <form>
                        <div className=' d-flex flex-column gap-3'>
                            <TextField error={!!errors.nom} helperText={errors.nom?.message ?? ""} size='small' label="Nom Utilisateur" variant="outlined" {...register("nom", { required: "Ce champs est requis" })} required />
                            <TextField type="password" size='small' label="Mot de passe" variant="outlined" {...register("password", { required: "Ce champs est requis" })} />

                        </div>
                        <div className=' pt-3 d-flex justify-content-end gap-2'>
                            <button className=' btn btn-success' onClick={handleSubmit(handleClick)} > Confirmer </button>
                            <button className=' btn btn-dark' onClick={() => { reset() }} > Reset </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
