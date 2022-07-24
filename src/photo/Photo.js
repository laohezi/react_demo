import React from "react";
import './Photo.css';
import PropTypes from 'prop-types'

class Photo extends React.Component {
    static  propTypes = {
        csss: PropTypes.string
    }
    static defaultProps = {
        csss: "photo"
    }

    render() {
        return (<img className={this.props.csss} src={this.props.url} alt={this.props.url}></img>);
    }

}

export class Photos extends React.Component {

    state = {
        csss: "photo"
    }

    render() {
        return (<div>
                <Photo csss={this.state.csss} url={this.props.url}></Photo>
                <button onClick={this.zoom}>click</button>
            </div>

        );
    }

    zoom = () => {
        this.setState({
            csss: "photo_hover"
        })
    }
}

export class PhotoList extends React.Component {

    render() {
        var items = this.props.datas.map((data) => {
            var single = []
            for (var i = 0; i < 1000; i++) {
                single.push((<li>
                    <Photo csss={"photo"} url={data} />
                </li>))
            }
            return <li>
                <ul>
                    {single}
                </ul>

            </li>
        })

        return <ul>
            {items}

        </ul>

    }
}


export class PhotoListWithPreview extends React.Component {
    dataList = ["https://th.bing.com/th/id/OIP.rHuc8SKa0wLVwCqqA27uIwHaEt?pid=ImgDet&rs=1", "http://static.runoob.com/images/demo/demo2.jpg"]
    render() {
        return (<PhotoList datas={this.dataList} />)
    }

}