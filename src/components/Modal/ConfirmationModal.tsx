
import { useCallback, MouseEvent, useMemo } from 'react'
import { StyledConfirmationModal } from './StyledConfirmationModal'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import $ from "jquery"
import { Electeur } from '../../models/Electeur';
import { useQueryClient } from '@tanstack/react-query';
import { loadElecteurs } from '../../redux/loadDataElecteurSlice';

export default function ConfirmationModal() {
    const queryClient = useQueryClient()
    const dispatch = useAppDispatch()
    const electeurSelector = useAppSelector((state) => { return state.electeur });
    const handleClick = useCallback((e: MouseEvent) => {

        let nameBtn = e.currentTarget.innerHTML.toLowerCase()
        console.log("button du clique", nameBtn);
        if (nameBtn === "valider") {
            if (electeurSelector.electeur && electeurSelector.electeur.id) {
                Electeur.update({ id: electeurSelector.electeur.id, valider: "OUI" });
                queryClient.invalidateQueries({ queryKey: ["electeurs"] });
                dispatch(loadElecteurs())
                $(".my-modal").addClass("d-none")
            }
        } else if (nameBtn === "invalider") {
            if (electeurSelector.electeur && electeurSelector.electeur.id) {
                Electeur.update({ id: electeurSelector.electeur.id, valider: "NON" })
                queryClient.invalidateQueries({ queryKey: ["electeurs"] });
                dispatch(loadElecteurs())
                $(".my-modal").addClass("d-none")
            }
        }
    }, [electeurSelector.electeur, dispatch, queryClient])


    const validationBtn = useMemo(() => {
        if (electeurSelector.electeur && electeurSelector.electeur.valider === "OUI") {
            return <button className=' btn btn-light' onClick={handleClick} >Invalider</button>
        } else {
            return <button className=' btn btn-success ' onClick={handleClick} >Valider</button>
        }
    }, [electeurSelector.electeur, handleClick])


    return (
        <StyledConfirmationModal className='my-modal d-none'>
            <div className=' bg-white fst-italic py-3 px-5 position-relative' >
                <p>Que Voulez-vous faire de l'electeur?</p>
                <hr />
                <div className=' d-flex gap-2 justify-content-around align-items-center' >

                    <button className=' btn btn-close' onClick={() => { $(".my-modal").addClass("d-none") }} />
                    {validationBtn}
                </div>
            </div>
        </StyledConfirmationModal>
    )
}
