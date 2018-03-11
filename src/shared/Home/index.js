'use strict';

// Dependencies
import { h, Component } from 'preact';
import fetch from 'isomorphic-fetch';
import Helmet from 'preact-helmet';
//import styles from './styles.css';

export default class extends Component {
    constructor() {
        super();

        this.state = {};
    }

    componentWillMount() {
        const data = fetch('https://192.168.12.44:3000/wp/index.php/wp-json/wp/v2/posts/?filter[posts_per_page]=1')
            .then((res) => res.json());

            console.log(data);

        const helmetMeta = {
            htmlAttributes: {
                lang: 'en'
            },
            title: 'Home',
            meta: [
                { name: 'description', content: 'This is the home page :)' }
            ]
        };


        this.setState({ helmetMeta: helmetMeta });
    }

    render({ }, { helmetMeta }) {

        return (
            <div>
                <Helmet {...helmetMeta} />
                Home
            </div>
        );
    }
}