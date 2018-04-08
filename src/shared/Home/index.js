'use strict';

// Dependencies
import { h, Component } from 'preact';
//import { createStore, Provider, connect } from 'unistore/full/preact';
import fetch from 'isomorphic-fetch';

// Local dependencies
//import { withData } from '../data';
//import styles from './styles.css';

// Constants

// Component
/*@withData({
    data: () => {
        return fetch('https://192.168.12.44:3000/wp/index.php/wp-json/wp/v2/posts/?filter[posts_per_page]=1')
            .then((res) => res.json());
    },
    mapToProps: (data) => ({ data }),
})*/
export default class extends Component {
    constructor() {
        super();

        this.state = {
            data: []
        };
    }

    componentWillMount() {
        console.log('fetch');
        fetch('https://192.168.12.44:3000/wp/index.php/wp-json/wp/v2/posts/?filter[posts_per_page]=1')
            .then((res) => res.json())
            .then((data) => this.setState({ data }));
    }

    render({ }, { data }) {
        console.log('render');
        console.log(data);

        return (
            <div>
                Hello Home :)
                <br />
                {JSON.stringify(data)}
            </div>
        );
    }
}