import styled from "styled-components";

export const StyledConfirmationModal = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #00000052;
    z-index: 99;

    & .btn-close{
        position: absolute;
        top: 5px;
        right: 5px;
    }
`