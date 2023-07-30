import { Button, TextField } from "@mui/material";
import { StyledConfirmationModal } from "./StyledConfirmationModal";
import $ from "jquery";
import { useAppSelector } from "../../redux/hooks";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IUtilisateur, Utilisateur } from "../../models/Utilisateur";
import { collection } from "firebase/firestore";

type TypeForm = {
    type: "admin" | "user" | null,
}

const btnModal = ["Admin", "User"] as const;
type BtnModal = typeof btnModal[number];

type ResetPassword = {
    confirmPassword: string,
    password: string,
}

export default function UserModal() {

    const [typeForm, setTypeForm] = useState<TypeForm>({ type: null });

    const { register, getValues, reset, handleSubmit, formState } = useForm<ResetPassword>();

    const [allUser, setAllUser] = useState<IUtilisateur[] | null>(null)


    const userAuth = useAppSelector((state) => state.utilisateur);

    useEffect(() => {
        const fetchAllUser = async () => {
            let dataUser = await Utilisateur.getAll();
            setAllUser(dataUser);
        }
        fetchAllUser()
    }, [])

    const handleClick = useCallback((e: MouseEvent) => {
        reset({ confirmPassword: "", password: "" });

        console.log("test nameBtn === 'Admin'", e.currentTarget.className.indexOf("Admin") !== -1)
        if (e.currentTarget.className.indexOf("Admin") !== -1) {
            setTypeForm({ type: "admin" })
        } else if (e.currentTarget.className.indexOf("User") != -1) {
            setTypeForm({ type: "user" })
        }
    }, [reset]);

    const closeModal = useCallback(() => {
        $(".user-modal").addClass("d-none"); reset({ confirmPassword: "", password: "" }); setTypeForm({ type: null })
    }, [reset])

    const handleEnregistrer: SubmitHandler<ResetPassword> = useCallback(async (data) => {
        $(".my-loader").removeClass("d-none")
        let user: IUtilisateur | null = null;
        if (typeForm.type && allUser) {

            for (let item of allUser) {
                if (item.type === typeForm.type) {
                    user = item
                }
            }

            if (data.confirmPassword === data.password && user?.id) {
                await Utilisateur.update({ password: data.password, id: user.id })
                closeModal()
                
            }
        }

        $(".my-loader").addClass("d-none")

    }, [allUser, typeForm, closeModal])



    const formResetPassword = useMemo(() => {
        console.log("errors ", formState.errors)
        let errors = formState.errors;
        return (
            <form action="">
                <div>
                    <div className=" border border-2 p-3 d-flex gap-2 flex-wrap">

                        <TextField error={!!errors.password} helperText={errors.password?.message ?? ""}  type="password" label="New Password"  {...register("password", { required: "Ce champs est requis", minLength: { value: 3, message: "Au moins 3 caractères" } })} variant="outlined" size="small" required />
                        <TextField error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message ?? ""}  type="password" label="Confirm Password" {...register("confirmPassword", { required: "Ce champs est requis", minLength: { value: 3, message: "Au moins 3 caractères" } })} variant="outlined" size="small" required />
                    </div>
                    <div className=" text-end p-2" > <button type="submit" className="btn btn-success" onClick={handleSubmit(handleEnregistrer)}  >Enregistrer</button> </div>
                </div>
            </form>
        )
    }, [formState, register, handleEnregistrer, handleSubmit])

    return (
        <StyledConfirmationModal className='user-modal d-none'>
            <div className=' bg-white fst-italic py-3 px-5 position-relative' >
                <p>
                    <Button variant="contained" color="primary" onClick={handleClick} className="Admin" >Admin</Button>
                </p>
                {
                    typeForm.type === "admin" ? formResetPassword : null
                }

                <hr className=" fw-bold" />
                <p>

                    <button className=' btn btn-close' onClick={() => {closeModal() }} />
                    <Button variant="contained" color="secondary" onClick={handleClick} className="User"  >User</Button>
                </p>
                {
                    typeForm.type === "user" ? formResetPassword : null

                }
            </div>
        </StyledConfirmationModal>
    )
}
