
import { useCallback, MouseEvent, useMemo, useState } from 'react'
import { StyledConfirmationModal } from './StyledConfirmationModal'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import $ from "jquery"
import { Electeur } from '../../models/Electeur';
import { useQueryClient } from '@tanstack/react-query';
import { loadElecteurs } from '../../redux/loadDataElecteurSlice';
import { loadFormData } from '../../redux/electeurSlice';

const typeButton = ["valider", "invalider", "gerer", "modifier", "supprimer"] as const;

export default function ConfirmationModal() {
    const [title, setTitle] = useState({formValidation:true, value:"Que voulez-vous faire de l'electeur?"});
    const queryClient = useQueryClient()
    const dispatch = useAppDispatch()
    const electeurSelector = useAppSelector((state) => { return state.electeur });
    const handleClick = useCallback(async (e: MouseEvent) => {
        $(".my-loader").removeClass("d-none")
        let nameBtn:typeof typeButton[number] = e.currentTarget.innerHTML.toLowerCase().trim() as any
        console.log("button du clique", nameBtn);
        if (nameBtn === "valider") {
            $(".my-modal").addClass("d-none")
            if (electeurSelector.electeur && electeurSelector.electeur.id) {
                await Electeur.update({ id: electeurSelector.electeur.id, valider: "OUI" });
                queryClient.invalidateQueries({ queryKey: ["electeurs"] });
                dispatch(loadElecteurs())
            }
        } else if (nameBtn === "invalider") {
            $(".my-modal").addClass("d-none")
            if (electeurSelector.electeur && electeurSelector.electeur.id) {
                await Electeur.update({ id: electeurSelector.electeur.id, valider: "NON" })
                queryClient.invalidateQueries({ queryKey: ["electeurs"] });
                dispatch(loadElecteurs())
            }
        } else if (nameBtn === "gerer"){
            console.log("Execution de gerer")
            setTitle({value:"Quel action voulez-vous menez sur l'electeur?", formValidation:false});
        } else if(nameBtn === "modifier"){
            dispatch(loadFormData(true))
            $(".my-modal").addClass("d-none")
            setTitle({formValidation:true, value:"Que voulez-vous faire de l'electeur?"})
        } else if (nameBtn ==="supprimer"){
            if (electeurSelector.electeur && electeurSelector.electeur.id) {
                $(".my-modal").addClass("d-none")
                await Electeur.delete(electeurSelector.electeur)
                queryClient.invalidateQueries({ queryKey: ["electeurs"] });
                dispatch(loadElecteurs());
                setTitle({formValidation:true, value:"Que voulez-vous faire de l'electeur?"})
            }
        }
        $(".my-loader").addClass("d-none")
    }, [electeurSelector.electeur, dispatch, queryClient, setTitle])

    const validationBtn = useMemo(() => {
        let btns;
        if (electeurSelector.electeur && electeurSelector.electeur.valider === "OUI") {
            btns =  <button className=' btn btn-danger my-btn' onClick={handleClick} >{typeButton[1]}</button>
        } else {
            btns = <button className=' btn btn-success my-btn' onClick={handleClick} >{typeButton[0]} </button>
        }

        if(!title.formValidation){
            return btns = <>
            <button className=' btn btn-primary my-btn' onClick={handleClick} >{typeButton[3]} </button>
            <button className=' btn btn-danger my-btn' onClick={handleClick} >{typeButton[4]} </button>
            </>
        }

        return btns = <>
            <button className=' btn btn-dark my-btn' onClick={handleClick} >{typeButton[2]} </button>
            {btns}
        </>
    }, [electeurSelector.electeur, handleClick, title])


    return (
        <StyledConfirmationModal className='my-modal d-none'>
            <div className=' bg-white fst-italic py-3 px-5 position-relative' >
                <p>{title.value}</p>
                
                <hr />
                <div className=' d-flex gap-2 justify-content-around align-items-center' >

                    <button className=' btn btn-close' onClick={() => { $(".my-modal").addClass("d-none"); setTitle({formValidation:true, value:"Que voulez-vous faire de l'electeur?"}) }} />
                    {validationBtn}
                </div>
            </div>
        </StyledConfirmationModal>
    )
}
