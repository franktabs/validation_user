import React from 'react'
import { useAppSelector } from '../redux/hooks';
import Home from './Home';
import Login from './Login';
import { StyledConfirmationModal } from '../components/Modal/StyledConfirmationModal';

export default function Index() {
    const connectedSelector = useAppSelector((state) => state.connectedAdmin);

    if (connectedSelector.value) return <>
    <StyledConfirmationModal className='my-loader d-none'>
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </StyledConfirmationModal>
        <Home />
    </>

    return <>
        <StyledConfirmationModal className='my-loader d-none'>
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </StyledConfirmationModal>
        <Login />
    </>
}
