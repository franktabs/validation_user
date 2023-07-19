import { useForm } from "react-hook-form";
import { TypeElecteur } from "../models/Electeur";
import { TextField } from "@mui/material";

export default function Login() {

    const { register, reset, handleSubmit, formState: { errors } } = useForm<{nom:string, password:string}>();

    return (
        <>
            <div className=' p-2 p-md-3 my-form'>
                <form>
                    <div className=' d-flex flex-column gap-3'>
                        <TextField error={!!errors.nom} helperText={errors.nom?.message ?? ""} size='small' id="outlined-basic" label="Nom" variant="outlined" {...register("nom", { required: "Ce champs est requis" })} required />
                        <TextField type="password" size='small' id="outlined-basic" label="Prenom" variant="outlined" {...register("password")} />

                    </div>
                    <div className=' pt-3 d-flex justify-content-end gap-2'>
                        <button className=' btn btn-success' onClick={handleSubmit(handleClick)} > Enregistrer </button>
                        <button className=' btn btn-dark' onClick={() => { reset() }} > Reset </button>
                    </div>
                </form>
            </div>
        </>
    )
}
