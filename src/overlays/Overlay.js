import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import '../overlays/Overlay.css'
import './model.js'
import store from './model'
import { actions } from './model'
import { OPRATION } from './model'
import { Canvas} from './Canvas';
import { ButtonArea } from './ButtonArea';


export class OverlayUtils extends React.Component {
    constructor(props) {
        super(props)
        //  this.onClickAction = this.onClickAction.bind(this)
        this.state = store.getState()
        store.subscribe(() => {
            this.setState(store.getState())
        })

    }



    render() {
        return (<div>
            <ContentArea />

            <JsonArea json={this.state.json} />

            <ButtonArea  />

        </div>);
    }

}

class JsonArea extends React.Component {

    render() {
        return (
            <div>{this.props.json}</div>
        );
    }
}

class ContentArea extends React.Component {


    constructor(props) {
        super(props)
        this.state = store.getState()
        store.subscribe(() => {
            this.setState(store.getState())
        })
        this.imageAra = React.createRef()
    }

    drop = (e) => {
        e.preventDefault()
        const items = e.dataTransfer.items;
        if (!items.length) return;
        if (items[0].kind === 'file' && items[0].webkitGetAsEntry().isFile) {
            const pathFile = URL.createObjectURL(items[0].getAsFile());
            console.log(pathFile)
            store.dispatch(actions.updateImage(pathFile))

        }
    }

    render() {
        return <div className='content' onDragEnter={(e) => e.preventDefault()}
            onDrop={this.drop}
            onDragOver={(e) => e.preventDefault()} >
            <img ref={this.imageAra} className="image_area" src={this.state.url}
            >
            </img>
            <Canvas
                /* opration={this.state != null ? this.state.opration : ACTION.CONTENT_RECT}
                ratio={this.state != null ? this.state.ratio : 1.0}
                w={this.state.w}
                h={this.state.h}
                bw={this.state.bw}
                bh={this.state.bh} */
            />


        </div>
    }

}






