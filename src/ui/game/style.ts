import styled from "styled-components";

export const GameWrapper = styled.div`
    width: 100%;
    height: 100%;

    .control{
        width:100%;
        height:100%
    }

   .container{
    position: absolute;
    left:50%;
    transform:translate(-50%);
    bottom:100px;
    background-color:#ccc3;
    border-radius: 30px;
    display: flex;
    align-items: center;
   }

   .color-item::after{
    content: "";
    display: block;
    position:relative;
    left:50%;
    top:50%;  
    transform:translate(-50%,-50%);  
    width:38px;
    height:38px;
    border-radius:50%;
    border:2px solid #fff;
   }

   .slider-line{
    height:100%;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    display:flex;
    justify-content: center;
    align-items: center;
    pointer-events:none;
   }
   .line{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    width:4px;
    height:100%;
    background-color:whitesmoke
   }

   .slider-container{
    width:48px;
    height:48px;
    display:flex;
    justify-content: center;
    align-items: center;
    background-color:whitesmoke;
    border-radius:12px;
    border:3px solid #efebec;
    cursor: pointer;
    pointer-events:auto;
   }
`;