import React from "react"
import store from './model'
import { actions } from './model'
import { OPRATION } from './model'
import '../overlays/Overlay.css'
export class Canvas extends React.Component {
    render() {
        return (
            <canvas ref={this.canvas} className="canvas" width={"600px"} height={"600px"}></canvas>
        )
    }
    constructor() {
        super()
        this.canvas = React.createRef()
        this.downX = 0
        this.downX = 0
        this.downY = 0
        this.upX = 0
        this.upY = 0

        this.isMouseDown = false
        this.state = store.getState()
        store.subscribe(() => {
            this.setState(store.getState())
        })

    }






    componentDidMount() {
        /** @type {HTMLCanvasElement} */
        const canvas = this.canvas.current
        const context = canvas.getContext('2d')
        context.strokeStyle = "#FF0000"
        // context.strokeRect(5, 5, canvas.width - 10, canvas.height - 10)
        console.log("canvas w=", canvas.width, "canvas height = ", canvas.height)
        var rect = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        }

        const slop = 10
        var HANDLE = {
            NEW: "0",
            LEFT: "1",
            TOP: "2",
            RIGHT: "3",
            BOTTOM: "4",
            MOVE: "5"
        }

        var handle = HANDLE.NEW


        var downRect
        var currentRect


        canvas.onmousedown = (e) => {
            this.isMouseDown = true
            this.downX = e.offsetX
            this.downY = e.offsetY

            downRect = { ...rect }

           
            if(this.state.action == OPRATION.CONTENT_RECT){
                this.handle = checkHandle(e)
            }
            

        }

        const updateJSon = () => {
            let json = {}
            json.width = 800
            json.height = 800
            let rect = this.safeRect
            json.left = rect.left
            json.top = rect.top
            json.right = rect.left + rect.width
            json.bottom = rect.top + rect.height
            store.dispatch(actions.updateJson(JSON.stringify(json)))

        }

        function checkHandle(e) {
            if (e.offsetY >= rect.top && e.offsetY <= (rect.top + rect.height)) {
                if (Math.abs(e.offsetX - rect.left) < slop) {
                    return HANDLE.LEFT
                } else if (Math.abs(e.offsetX - (rect.left + rect.width)) < slop) {
                    return HANDLE.RIGHT
                } else if (Math.abs(e.offsetY - rect.top) < slop) {
                    return HANDLE.TOP
                } else if (Math.abs(e.offsetY - (rect.top + rect.height)) < slop) {
                    return HANDLE.BOTTOM
                } else if (e.offsetX > rect.left && e.offsetX < rect.left + rect.width) {
                    return HANDLE.MOVE
                }
            } else if (e.offsetX >= rect.left && e.offsetX <= (rect.left + rect.width)) {
                if (Math.abs(e.offsetY - rect.top) < slop) {
                    return HANDLE.TOP
                } else if (Math.abs(e.offsetY - (rect.top + rect.height)) < slop) {
                    return HANDLE.BOTTOM
                } else if (Math.abs(e.offsetX - rect.left) < slop) {
                    return HANDLE.LEFT
                } else if (Math.abs(e.offsetX - (rect.left + rect.width)) < slop) {
                    return HANDLE.RIGHT
                } else if (e.offsetY > rect.top && e.offsetY < rect.top + rect.height) {
                    return HANDLE.MOVE
                }
            } else {
                return HANDLE.NEW
            }
        }

        const updateNewRect = (e) => {
            rect.left = this.downX;
            rect.top = this.downY;
            rect.width = e.offsetX - this.downX;
            rect.height = rect.width / this.state.ratio;
            context.strokeRect(rect.left, rect.top, rect.width, rect.height);
        }

        const handleLeft = (e) => {
            rect.left = e.offsetX;
            rect.width = downRect.width + (this.downX - e.offsetX);
            rect.height = rect.width / this.state.ratio;
            context.strokeRect(rect.left, rect.top, rect.width, rect.height);
        }
        const handleRight = (e) => {
            rect.width = downRect.width + (e.offsetX - this.downX);
            rect.height = rect.width / this.state.ratio;
            rect.left = e.offsetX - rect.width

            context.strokeRect(rect.left, rect.top, rect.width, rect.height);
        }

        const handleTop = (e) => {
            rect.top = e.offsetY;
            rect.height = downRect.height + (this.downY - e.offsetY);
            rect.width = rect.height * this.state.ratio;
            context.strokeRect(rect.left, rect.top, rect.width, rect.height);
        }

        const handleBottom = (e) => {
            rect.height = downRect.height + (e.offsetY - this.downY);
            rect.width = rect.height * this.state.ratio;
            rect.top = e.offsetY - rect.height

            context.strokeRect(rect.left, rect.top, rect.width, rect.height);
        }

        const handleMove = (e) => {
            rect.left = downRect.left + (e.offsetX - this.downX)
            rect.top = downRect.top + (e.offsetY - this.downY)
            rect.width = downRect.width
            rect.height = downRect.height

            context.strokeRect(rect.left, rect.top, rect.width, rect.height);
        }

        canvas.onmouseout = (e) => {
            this.isMouseDown = false
        }
        canvas.onmousemove = (e) => {
            if (this.isMouseDown) {
                context.clearRect(0, 0, canvas.width, canvas.height)
                if (this.handle == HANDLE.LEFT) {
                    handleLeft(e);
                } else if (this.handle == HANDLE.RIGHT) {
                    handleRight(e)
                } else if (this.handle == HANDLE.TOP) {
                    handleTop(e)
                } else if (this.handle == HANDLE.BOTTOM) {
                    handleBottom(e)
                } else if (this.handle == HANDLE.MOVE) {
                    handleMove(e)
                } else {
                    updateNewRect(e);
                }

                this.safeRect = { ...rect }
                this.withBleedRect = {}
                this.withBleedRect.left = this.safeRect.left - (this.safeRect.width / this.state.w * this.state.bw)
                this.withBleedRect.top = this.safeRect.top - (this.safeRect.height / this.state.h * this.state.bh)
                this.withBleedRect.width = (this.safeRect.width / this.state.w) * (Number.parseFloat(this.state.w) + this.state.bw * 2)
                this.withBleedRect.height = (this.safeRect.height / this.state.h) * (Number.parseFloat(this.state.h) + this.state.bh * 2)
                drawReact(context, this.withBleedRect)
            }


        }

        canvas.onmouseup = (e) => {
            this.isMouseDown = false
            updateJSon()

        }

        function drawReact(draw, rect) {
            draw.strokeRect(rect.left, rect.top, rect.width, rect.height)
        }
    }



}
