import React from "react";
import './index.css'

export class Caculator extends React.Component{

    render(){
        return (
           <div>
               <h2>The result is 0</h2>
               <div>
                   <input placeholder="0"/>
                   <button className="button">increament</button>
                   <button className="button">decreament</button>                   
               </div>
           </div>
        );
    }

}

